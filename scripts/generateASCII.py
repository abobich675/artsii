from google import genai
import random
import sys
from toASCII import create_ascii
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')
client = genai.Client(api_key = api_key)
    
def run(prompt, style):
    imagePath = generate_image(prompt)
    result = generate_ascii(imagePath, style)
    return result

def generate_image(prompt: str):
    response = client.models.generate_images(
        model='imagen-4.0-generate-001',
        prompt=prompt
    )
    
    path = f"generated_images/{random.randint(0, sys.maxsize)}.png"
    for generated_image in response.generated_images:
        generated_image.image.save(path)
    return path

def generate_ascii(imagePath, style):
    result = create_ascii(imagePath, style)
    return result