import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const ImagePartSchema = z.object({
  inlineData: z.object({
    data: z.string(),
    mimeType: z.string(),
  }),
});

const ResponseSchema = z.object({
  candidates: z.array(
    z.object({
      content: z.object({
        parts: z.array(z.union([ImagePartSchema, z.object({ text: z.string() })])),
      }),
    })
  ),
});

async function generateSingleImage(prompt: string): Promise<string> {
  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
    },
  });

  const parsed = ResponseSchema.safeParse(response);
  if (!parsed.success) throw new Error(`Invalid response: ${parsed.error.message}`);

  const candidate = parsed.data.candidates[0];
  if (!candidate) throw new Error("No candidates in response");

  for (const part of candidate.content.parts) {
    if ("inlineData" in part) return part.inlineData.data;
  }
  throw new Error("No image in response");
}

export async function generateImageCandidates(prompt: string, count: number = 4): Promise<string[]> {
  if (!prompt) throw new Error("Prompt is required");
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

  const promises = Array(count).fill(prompt).map(p => generateSingleImage(p));
  return Promise.all(promises);
}
