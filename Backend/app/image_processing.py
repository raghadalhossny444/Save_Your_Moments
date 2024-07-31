from .image_analysis_pipeline import ImageAnalysisPipeline
import logging

logger = logging.getLogger(__name__)

def process_image(image_path, strategy='pipeline'):
    try:
        pipeline = ImageAnalysisPipeline()
        if strategy == 'pipeline':
            # Using the full pipeline
            results = pipeline.analyze_image(image_path)
            caption = results['caption']
        elif strategy == 'llm':
            # Directly using the LLM for vision-based description
            caption = pipeline.process_image_gpt4o_mini(image_path)
        else:
            raise ValueError("Invalid strategy specified.")
        
        logger.info(f"Generated caption: {caption}")
        return caption
    except Exception as e:
        logger.error(f"Error processing image {image_path}: {e}")
        return "Error generating caption."
