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
    if os.getenv('USE_AI') == "true":
        imagePath = generate_image(prompt)
    else:
        imagePath = find_image()
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

def find_image():
    folder = "generated_images"
    images = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(".png"):
            images.append(os.path.join(folder, filename))
    if images == []:
        return None  # No PNG found
    return images[random.randint(0, sys.maxsize) % len(images)]

def generate_ascii(imagePath, style):
    result = create_ascii(imagePath, style)
    return result