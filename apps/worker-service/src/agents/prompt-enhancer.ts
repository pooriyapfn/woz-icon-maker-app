import OpenAI from "openai";
import { PROMPT_ENHANCER_AGENT_PROMPT } from "../prompts/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function improvePrompt(
  userPrompt: string,
  count: number = 1,
  hasLogo: boolean = false,
): Promise<string[]> {
  if (!userPrompt) return Array(count).fill("");

  if (!process.env.OPENAI_KEY) {
    console.error("Missing OPENAI_KEY");
    return Array(count).fill(userPrompt);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        { role: "system", content: PROMPT_ENHANCER_AGENT_PROMPT },
        { role: "user", content: userPrompt },
      ],
      n: count,
    });

    const logoSuffix = hasLogo
      ? "\n Important: Use the uploaded photo is the user logo."
      : "";

    const improvedPrompts = completion.choices.map((choice) => {
      const content = choice.message?.content?.trim();
      return (content || userPrompt) + logoSuffix;
    });

    console.log(`Generated ${improvedPrompts.length} prompt variations`);
    improvedPrompts.forEach((p, i) => console.log(`  [${i}]: "${p}"`));

    return improvedPrompts;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(`OpenAI API Error [${error.status}]: ${error.message}`);
    } else {
      console.error("OpenAI Prompt Improvement Failed:", error);
    }
    return Array(count).fill(userPrompt);
  }
}
