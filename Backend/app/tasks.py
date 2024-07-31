from celery import shared_task
from .models import Photo
from .image_analysis_pipeline import ImageAnalysisPipeline
import logging
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

@shared_task
@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=4, max=60))
def generate_caption(photo_id, strategy='pipeline',lang='en'):
    try:
        photo = Photo.objects.get(id=photo_id)
        logger.info(f"Generating caption for photo_id: {photo_id}")
        
        pipeline = ImageAnalysisPipeline(lang=lang)
        
        if strategy == 'pipeline':
            results = asyncio.run(pipeline.analyze_image(photo.photo.path))
            caption = results['caption']
        elif strategy == 'llm':
            caption = asyncio.run(pipeline.process_image_gpt4o_mini(photo.photo.path))
        else:
            raise ValueError("Invalid strategy specified.")
        
        logger.info(f"Generated caption: {caption}")
        photo.caption = caption
        photo.save()
        logger.info(f"Caption saved for photo_id: {photo_id}")
    except Photo.DoesNotExist:
        logger.error(f"Photo with id {photo_id} does not exist.")
    except Exception as e:
        logger.error(f"Error generating caption for photo_id: {photo_id} - {e}")
