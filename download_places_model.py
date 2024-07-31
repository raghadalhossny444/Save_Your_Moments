import requests

def download_places365_model():
    url = "http://places2.csail.mit.edu/models_places365/resnet50_places365.pth.tar"
    response = requests.get(url, stream=True)
    with open("Backend/resnet50_places365.pth.tar", "wb") as file:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                file.write(chunk)
    print("Model downloaded successfully.")

# Call the function to download the model
download_places365_model()
