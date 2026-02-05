import OpenAI from "openai";
import { PROMPT_ENHANCER_AGENT_PROMPT } from "../prompts/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function improvePrompt(userPrompt: string): Promise<string> {
  if (!userPrompt) return "";

  if (!process.env.OPENAI_KEY) {
    console.error("Missing OPENAI_KEY");
    return userPrompt;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: PROMPT_ENHANCER_AGENT_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.warn(
        "!!! No content returned from OpenAI, using original prompt",
      );
      return userPrompt;
    }

    const improvedPrompt = content.trim();
    console.log(`Prompt Improved: "${improvedPrompt.slice(0, 50)}..."`);
    return improvedPrompt;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`OpenAI API Error [${error.status}]: ${error.message}`);
    } else {
      console.error("OpenAI Prompt Improvement Failed:", error);
    }
    return userPrompt;
  }
}
