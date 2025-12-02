// To run this code you need to install the following dependencies:
// npm install @google/genai
// npm install -D @types/node

import { GoogleGenAI, PersonGeneration } from "@google/genai";
import "dotenv/config";
import { writeFile } from "fs";

function saveBinaryFile(fileName: string, content: Buffer) {
  writeFile(fileName, content, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

async function main() {
  console.log(process.env.GEMINI_API_KEY);
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateImages({
    model: "models/imagen-4.0-fast-generate-001",
    prompt: "A futuristic city skyline at sunset",
    config: {
      numberOfImages: 1,
      outputMimeType: "image/jpeg",
      personGeneration: PersonGeneration.ALLOW_ALL,
      aspectRatio: "9:16",
    },
  });

  if (!response?.generatedImages) {
    console.error("No images generated.");
    return;
  }

  if (response.generatedImages.length !== 1) {
    console.error(
      "Number of images generated does not match the requested number."
    );
  }

  for (let i = 0; i < response.generatedImages.length; i++) {
    if (!response.generatedImages?.[i]?.image?.imageBytes) {
      continue;
    }
    const fileName = `image_${i}.jpeg`;
    const inlineData = response?.generatedImages?.[i]?.image?.imageBytes;
    const buffer = Buffer.from(inlineData || "", "base64");
    saveBinaryFile(fileName, buffer);
  }
}

main();
