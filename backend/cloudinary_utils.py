import cloudinary
import cloudinary.api
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def obtener_imagenes_cloudinary(limit=100):
    try:
        response = cloudinary.Search() \
            .expression("folder:posts") \
            .sort_by("created_at", "desc") \
            .max_results(limit) \
            .execute()

        urls = [r["secure_url"] for r in response.get("resources", [])]
        return urls
    except Exception as e:
        print("Error al obtener imágenes:", e)
        return []
