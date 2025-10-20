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
MODELS = ["imagen-4.0-fast-generate-001", "imagen-3.0-generate-002", "imagen-4.0-generate-001", "imagen-4.0-ultra-generate-001"]
    
def run(prompt, style):
    global api_key
    if os.getenv('USE_AI') == "true":
        imagePath = generate_image(prompt)
    if os.getenv('USE_AI') != "true" or not imagePath:
        imagePath = find_image()
    result = generate_ascii(imagePath, style)
    return result

def generate_image(prompt: str):
    for model in MODELS:
        success = False
        try:
            response = client.models.generate_images(
                model=model,
                prompt=prompt
            )
            success = True
        except Exception as e:
            print("Error generating image: ", e)
            # You can check for quota specifically
            if e.status_code == 429:
                print(f"Quota exceeded or rate-limited: {model}.")
        
        if success:
            break
    
    if not success:
        return False
        
    
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