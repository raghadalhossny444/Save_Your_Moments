import asyncio
import textwrap
import cv2
import numpy as np
from ultralytics import YOLO
from deepface import DeepFace
import easyocr
import requests
import base64
from PIL import Image
import torch
from torchvision import models, transforms
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from tenacity import retry, stop_after_attempt, wait_exponential
from PIL import Image

def preprocess_image(image_path, target_size=(800, 800)):
    with Image.open(image_path) as img:
        img.thumbnail(target_size, Image.LANCZOS)
        img.save(image_path+"resized_image.jpg")
    return image_path+"resized_image.jpg"
class ImageAnalysisPipeline:
    def __init__(self,lang):
        self.yolo_model = YOLO('yolov8x.pt')
        self.pose_model = YOLO('yolov8n-pose.pt')
        self.scene_model = self.load_scene_classification_model()
        self.weather_processor, self.weather_model = self.load_weather_model()
        self.easyocr_reader = easyocr.Reader(['en'])
        self.gpt4_api_key = "sk-proj-z6HWh3Bp2X3XsQb3GTpCT3BlbkFJR4HUPbhr19YfLFXOCKSU"  # Replace with your actual API key
        self.object_confidence_threshold = 0.3
        self.pose_confidence_threshold = 0.3
        self.emotion_confidence_threshold = 0.3
        self.text_confidence_threshold = 0.1
        self.scene_confidence_threshold = 0.3
        self.weather_confidence_threshold = 0.3
        self.language = "English" if lang == 'en' else 'Arabic'
    
    def load_scene_classification_model(self):
        model = models.resnet50(pretrained=False)
        model.fc = torch.nn.Linear(model.fc.in_features, 365)
        state_dict = torch.load('resnet50_places365.pth.tar', map_location=torch.device('cpu'))['state_dict']
        state_dict = {k.replace('module.', ''): v for k, v in state_dict.items()}
        model.load_state_dict(state_dict)
        model.eval()
        return model

    def load_weather_model(self):
        model_name = "DunnBC22/vit-base-patch16-224-in21k-weather-images-classification"
        processor = AutoFeatureExtractor.from_pretrained(model_name)
        model = AutoModelForImageClassification.from_pretrained(model_name)
        return processor, model

    async def analyze_image(self, image_path):
        resized_image_path = preprocess_image(image_path)
        image = cv2.imread(resized_image_path)
        results = {}

        # Step 1: Parallel Execution
        object_task = asyncio.create_task(self.run_yolo(image))
        scene_task = asyncio.create_task(self.classify_scene(image))

        # Wait for initial parallel tasks to complete
        results['object_detection'] = await object_task
        results['scene_classification'] = await scene_task

        # Step 2: Conditional Execution based on results
        tasks = []

        # If people are detected, run pose estimation and emotion analysis
        person_objects = [obj for obj in results['object_detection'] if obj['class'] == 'person']
        if person_objects:
            tasks.append(self.run_pose_estimation(image, person_objects))
            tasks.append(self.analyze_emotions(image, person_objects))

        # If the scene is outdoor with sufficient confidence, run weather detection
        tasks.append(self.detect_weather(image_path))

        # If objects suggest the presence of text, run text detection
        # if any(obj['class'] in ['sign', 'document'] for obj in results['object_detection']):
        tasks.append(self.detect_text(image))

        # Await all conditional tasks
        additional_results = await asyncio.gather(*tasks)

        # Collect conditional results
        if person_objects:
            results['pose_estimation'] = additional_results.pop(0)
            results['emotion_analysis'] = additional_results.pop(0)
        if 'outdoor' in results['scene_classification'].get('attributes', []) and results['scene_classification']['confidence'] >= self.scene_confidence_threshold:
            results['weather_detection'] = additional_results.pop(0)
        if any(obj['class'] in ['sign', 'document'] for obj in results['object_detection']):
            results['text_detection'] = additional_results.pop(0)

        # Step 3: Generate Caption using GPT-4
        results['caption'] = await self.generate_caption(results)
        print(results)
        
        return results

    async def run_yolo(self, image):
        results = self.yolo_model(image)
        detected_objects = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0]
                conf = box.conf[0]
                cls = int(box.cls[0])
                name = self.yolo_model.names[cls]
                if conf >= self.object_confidence_threshold:
                    detected_objects.append({
                        'class': name,
                        'confidence': float(conf),
                        'bounding_box': {
                            'x1': int(x1),
                            'y1': int(y1),
                            'x2': int(x2),
                            'y2': int(y2)
                        }
                    })
        return detected_objects

    async def run_pose_estimation(self, image, person_objects):
        results = self.pose_model(image)
        poses = []
        for r in results:
            for i, pose in enumerate(r.keypoints.data):
                if i < len(person_objects):
                    keypoints = {}
                    for j, kp in enumerate(pose):
                        x, y, conf = kp
                        if conf >= self.pose_confidence_threshold:
                            keypoints[f"kp_{j}"] = [float(x), float(y), float(conf)]
                    overall_conf = float(pose[:, 2].mean())
                    if overall_conf >= self.pose_confidence_threshold:
                        poses.append({
                            "keypoints": keypoints,
                            "overall_confidence": overall_conf,
                            "bounding_box": person_objects[i]['bounding_box']
                        })
        return poses

    async def classify_scene(self, image):
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])

        input_tensor = preprocess(Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB)))
        input_batch = input_tensor.unsqueeze(0)

        with torch.no_grad():
            output = self.scene_model(input_batch)

        _, indices = torch.sort(output, descending=True)
        percentage = torch.nn.functional.softmax(output, dim=1)[0] * 100
        categories = self.load_categories()

        top_5 = [(categories[idx], percentage[idx].item()) for idx in indices[0][:5]]

        main_category = top_5[0][0].split('/')[0]
        sub_categories = list(set([cat.split('/')[1] for cat, _ in top_5 if '/' in cat]))

        attributes = []
        if any('outdoor' in cat for cat, _ in top_5):
            attributes.append('outdoor')
        if any('indoor' in cat for cat, _ in top_5):
            attributes.append('indoor')

        return {
            "scene_class": main_category,
            "confidence": top_5[0][1] / 100,
            "sub_categories": sub_categories,
            "attributes": attributes,
            "top_5_predictions": top_5
        }

    def load_categories(self):
        with open('categories_places365.txt', 'r') as f:
            categories = [line.strip().split(' ')[0][3:] for line in f]
        return categories

    async def detect_weather(self, image_path):
        image = Image.open(image_path)
        inputs = self.weather_processor(images=image, return_tensors="pt")

        with torch.no_grad():
            outputs = self.weather_model(**inputs)

        predicted_class_idx = outputs.logits.argmax(-1).item()
        predicted_class = self.weather_model.config.id2label[predicted_class_idx]
        confidence = torch.nn.functional.softmax(outputs.logits, dim=-1)[0][predicted_class_idx].item()

        if confidence >= self.weather_confidence_threshold:
            return {"weather": predicted_class, "confidence": confidence}
        return {}

    async def analyze_emotions(self, image, person_objects):
        emotions = []
        for person in person_objects:
            x1, y1, x2, y2 = person['bounding_box'].values()
            face_img = image[y1:y2, x1:x2]
            result = DeepFace.analyze(face_img, actions=['emotion'], enforce_detection=False)
            if result and result[0]['emotion']:
                emotion = max(result[0]['emotion'], key=result[0]['emotion'].get)
                confidence = result[0]['emotion'][emotion]
                if confidence >= self.emotion_confidence_threshold:
                    emotions.append({"emotion": emotion, "confidence": confidence, "bounding_box": person['bounding_box']})
        return emotions

    async def detect_text(self, image):
        result = self.easyocr_reader.readtext(image)
        detected_texts = [{"text": text, "confidence": prob} for (_, text, prob) in result if prob >= self.text_confidence_threshold]
        return detected_texts

    @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=4, max=60))
    async def call_gpt4_api(self, prompt):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.gpt4_api_key}"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 100
        }
        response = await asyncio.to_thread(
            requests.post,
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload
        )
        return response.json()

    async def generate_caption(self, results):
        print(results)
        prompt = f"Based on the following analysis results, generate a caption for the image that is engaging but not overly emotional or dry. The caption should describe the scene and its elements in 20 to 50 words, please use This language {self.language} but seem to be native anyways, don't just make it look like a translation:\n{results}"
        response = await self.call_gpt4_api(prompt)
        return response['choices'][0]['message']['content']

    @retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=4, max=60))
    async def process_image_gpt4o_mini(self, image_path):
        try:
            resized_image_path = preprocess_image(image_path)
            # Encode the image in base64
            with open(resized_image_path, "rb") as image_file:
                base64_image = base64.b64encode(image_file.read()).decode('utf-8')

            # Headers for the request
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.gpt4_api_key}"
            }

            # Payload for the API request
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"Here's an image to be captioned. generate a caption for the image that is engaging but not overly emotional or dry. The caption should describe the scene and its elements in 20 to 50 words, please use This language {self.language} but seem to be native anyways, don't just make it look like a translation"
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 100  # Adjusting for 20-50 words limit
            }

            # Make the request in a separate thread to avoid blocking
            response = await asyncio.to_thread(
                requests.post,
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            )

            # Parse the JSON response
            response_json = response.json()

            # Log the full response for debugging
            print(f"API Response: {response_json}")

            # Extract and return the caption
            if 'choices' in response_json:
                return response_json['choices'][0]['message']['content']
            else:
                # Handle cases where 'choices' is not present
                print(f"Unexpected API response format: {response_json}")
                return "Unable to generate caption. Please try again."

        except requests.exceptions.RequestException as e:
            # Handle connection errors or other requests-related errors
            print(f"Request failed: {e}")
            return "Error communicating with the caption generation service."
        except Exception as e:
            # General exception catch
            print(f"An error occurred: {e}")
            return "An error occurred while processing the image."
