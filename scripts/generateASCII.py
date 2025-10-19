from google import genai
from google.genai import types
import random
import sys
from toASCII import run

client = genai.Client(api_key="AIzaSyBKlcOWRASNYeCo0OFeDMna3Koynhg-iBU")
    
def run(prompt):
    imagePath = generate_image(prompt)
    result = generate_ascii(imagePath)
    return result

def generate_image(prompt: str):
    response = client.models.generate_images(
        model='imagen-4.0-generate-001',
        prompt=prompt
    )
    
    path = f"generated_images/{random.randint(0, sys.maxsize)}.png"
    for generated_image in response.generated_images:
        generated_image.image.save(path)
    return prompt

def generate_ascii(imagePath):
    result = run()
    return result