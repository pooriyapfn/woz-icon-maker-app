import "dotenv/config";

interface ExecutionResult {
  prompts: string[];
  durationMs: number;
}

async function executeWithTiming(
  improvePrompt: (prompt: string, count: number) => Promise<string[]>,
  userPrompt: string,
  count: number = 1,
): Promise<ExecutionResult> {
  const start = performance.now();
  const prompts = await improvePrompt(userPrompt, count);
  const end = performance.now();

  return {
    prompts,
    durationMs: Math.round(end - start),
  };
}

async function main() {
  // Dynamic import after dotenv is loaded
  const { improvePrompt } = await import("../src/agents/prompt-enhancer.js");

  const testPrompts = [
    "a cat logo",
    "modern tech company icon",
    "coffee shop brand mark",
  ];

  const count = parseInt(process.argv[2] || "3", 10);

  console.log("=".repeat(60));
  console.log("Prompt Enhancer Executor");
  console.log(`Generating ${count} variations per prompt`);
  console.log("=".repeat(60));

  for (const prompt of testPrompts) {
    console.log(`\nInput: "${prompt}"`);
    console.log("-".repeat(40));

    const { prompts, durationMs } = await executeWithTiming(
      improvePrompt,
      prompt,
      count,
    );

    console.log(`Results (${prompts.length} variations):`);
    prompts.forEach((p, i) => {
      console.log(`  [${i + 1}] ${p}`);
    });
    console.log(`\nExecution time: ${durationMs}ms`);
    console.log("-".repeat(40));
  }

  console.log("\n" + "=".repeat(60));
  console.log("Executor finished");
  console.log("=".repeat(60));
}

main().catch(console.error);
