import logging
from celery import shared_task
from .models import Photo

logger = logging.getLogger(__name__)

@shared_task
def generate_caption(photo_id):
    logger.info(f"Received task to generate caption for photo_id: {photo_id}")
    try:
        photo = Photo.objects.get(id=photo_id)
        logger.info(f"Fetched photo from database: {photo.photo.path}")
        # Assuming `process_image` is a function that takes the image path and returns a caption
        caption = process_image(photo.photo.path)
        logger.info(f"Generated caption: {caption}")
        photo.caption = caption
        photo.save()
        logger.info(f"Saved caption to database for photo_id: {photo_id}")
    except Exception as e:
        logger.error(f"Error generating caption for photo_id: {photo_id} - {e}")

def process_image(image_path):
    # Implement your AI model call here
    return "Generated caption for the image"
