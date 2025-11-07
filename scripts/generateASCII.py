from google import genai
import random
import sys
from toASCII import create_ascii
from dotenv import load_dotenv
import os
import json
from storeImg import upload_blob_from_file, upload_blob_from_bytes
from google.cloud import storage

load_dotenv()
# AI
api_key = os.getenv('GOOGLE_API_KEY')
client = genai.Client(api_key = api_key)
MODELS = ["imagen-4.0-fast-generate-001", "imagen-3.0-generate-002", "imagen-4.0-generate-001", "imagen-4.0-ultra-generate-001"]

# Storage
storage_client = storage.Client()
    
def run_generation(prompt, style):
    global api_key
    path = None
    if os.getenv('USE_AI') == "true":
        image_bytes, path = generate_image(prompt)
    if os.getenv('USE_AI') != "true" or not image_bytes:
        image_bytes = find_image()
    result = create_ascii(image_bytes, style)
    return (result, path)

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
    
    # path = f"generated_images/{random.randint(0, sys.maxsize)}.png"
    path = f"{random.randint(0, sys.maxsize)}.png"
    for generated_image in response.generated_images:
        image_bytes = generated_image.image.image_bytes
        upload_blob_from_bytes("ascii-gemini-images", image_bytes, path)

        # upload_blob_from_bytes("ascii-gemini-images", image_bytes, path.split("/")[1])
    #     generated_image.image.save(path)
    # upload_blob_from_file("ascii-gemini-images", path, path.split("/")[1])
    
    return (image_bytes, path)

def find_image():
    folder = "generated_images"
    images = []
    for filename in os.listdir(folder):
        if filename.lower().endswith(".png"):
            images.append(os.path.join(folder, filename))
    if images == []:
        return None  # No PNG found
    
    selected_image = images[random.randint(0, sys.maxsize) % len(images)]
    with open(selected_image, 'rb') as f:
        return f.read()
    

# NO LONGER USED
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
        
def run_fetch(path, style):
    bucket = storage_client.bucket("ascii-gemini-images")
    blob = bucket.blob(path)
    
    image_bytes = blob.download_as_bytes()
    result = create_ascii(image_bytes, style)
    return result