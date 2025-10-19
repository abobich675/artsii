'use server'
import fs from "fs";

export async function generateImage(prompt: string, style: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:6969/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt, style: style })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Failed to generate image:', error);
        return ""
    }
}

type ColoredChar = {
  char: string;
  color: string;
};

type GalleryItem = {
  ascii: string | ColoredChar[][];
  style: string;
}

export async function addToGallery(ascii: string | ColoredChar[][], style: string) : Promise<boolean> {
  const filePath = "public/gallery.json";

  let data: GalleryItem[] = [];

  if (fs.existsSync(filePath)) {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(fileContent);
    } catch (err) {
      console.error("Error reading gallery.json:", err);
      data = [];
    }
  }

  const newItem: GalleryItem = {
    ascii,
    style,
  };

  data.push(newItem);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Added to gallery.json`);

  return true
}
