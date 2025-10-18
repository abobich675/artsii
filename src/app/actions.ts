'use server'
import { GoogleGenAI } from "@google/genai";
import Image from "next/image";
import * as fs from "node:fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function generateImage(prompt: string) : Promise<string> {
    console.log("attempting to generate")
    // console.log(await ai.models.list())
    const res = await ai.models.generateImages({
        model: 'imagen-4.0-fast-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
        },
    });

    let imagePath = ""
    if (res && res.generatedImages) {
        let idx = 1;
        for (const generatedImage of res.generatedImages) {
            if (!generatedImage.image) continue
            const imgBytes = generatedImage.image.imageBytes;

            if (!imgBytes) continue
            const buffer = Buffer.from(imgBytes, "base64");

            imagePath = `image-${Date.now()}-${Math.floor(Math.random() * 10000)}.png`
            fs.writeFileSync(imagePath, buffer);
            idx++;
        }
    }
    console.log(imagePath ? "successful generation" : "failed generation")
    return imagePath
}
