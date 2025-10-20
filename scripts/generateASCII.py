from google import genai
import random
import sys
from toASCII import create_ascii
from dotenv import load_dotenv
import os
import json

load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')
client = genai.Client(api_key = api_key)
    
def run(prompt, style):
    global api_key
    if os.getenv('USE_AI') == "true":
        successful = False
        for i in range(4):
            try:
                api_key = os.getenv(f'GOOGLE_API_KEY{i+1 if i != 0 else ""}')
                if api_key == "":
                    continue
                    
                imagePath = generate_image(prompt)
                successful = True
                break
            except:
                pass
    if os.getenv('USE_AI') != "true" or not successful:
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
    # add_to_gallery(imagePath, result, style)
    return result

def add_to_gallery(imagePath, ascii, style):
    if os.path.exists("public/gallery.json"):
        with open("public/gallery.json", "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = []
        
    new_item = {
        "name": imagePath + "_" + style,
        "ascii": ascii,
        "style": style
    }
    
    data.append(new_item)
        
    with open("public/gallery.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)