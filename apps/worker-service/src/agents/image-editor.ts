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

export async function editImage(
  sourceBase64: string,
  editPrompt: string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

  const contents = [
    {
      inlineData: {
        data: sourceBase64,
        mimeType: "image/png",
      },
    },
    {
      text: `Edit this icon image according to the following instruction: ${editPrompt}. Keep the overall icon style and format suitable for app icons.`,
    },
  ];

  const response = await genai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents,
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
