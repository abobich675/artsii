'use server'
import { GoogleGenAI } from "@google/genai";
import Image from "next/image";
import * as fs from "node:fs";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:5000/api/endpoint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt, count: 42 })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Failed to generate image:', error);
        throw error;
    }
}
