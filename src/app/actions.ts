'use server'
import { PrismaClient } from "@prisma/client"
import fs from "fs";

const prisma = new PrismaClient()

export async function generateImage(prompt: string, style: string): Promise<{
  ascii: string,
  style: string,
  path: string
} | false> {
  try {
      const response = await fetch('http://127.0.0.1:6969/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt, style: style })
      });
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return {
          ascii: data.ascii,
          style: data.style,
          path: data.path
      };
  } catch (error) {
      console.error('Failed to generate image:', error);
      return false
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

export async function addToDatabase(image: string, style: string, title: string = "", prompt: string = "", user: string = "", includeInGallery: boolean = false) {

  const res = await prisma.post.create({
    data: {
      image: image,
      style: style,
      title: title,
      prompt: prompt,
      user: user,
      gallery: includeInGallery
    }
  })

  return !!res
}

export async function getGalleryContents() {
  const res = await prisma.post.findMany({
    where: {
      gallery: true
    }
  })

  if (!res || res.length === 0) {
    return false
  }

  return res.reverse()
}

export async function getDatabaseAscii(path: string, style: string) {
  try {
    const response = await fetch('http://127.0.0.1:6969/api/get-database-ascii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: path, style: style })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
        ascii: data.ascii,
        style: data.style,
        path: data.path
    };
  } catch (error) {
      console.error('Failed to generate image:', error);
      return false
  }
}