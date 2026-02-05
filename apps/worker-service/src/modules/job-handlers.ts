import path from "path";
import fs from "fs-extra";
import { supabase, WORK_DIR } from "../config.js";
import { improvePrompt } from "../agents/prompt-enhancer.js";
import { generateImageCandidates } from "../agents/image-generator.js";
import { createAssetBundle } from "./processor.js";
import { downloadFile } from "../utils/download.js";

export async function handleNewJob(job: any) {
  const { id, prompt } = job;
  console.log(`[Phase 1] New Job: ${id}`);

  try {
    await supabase
      .from("jobs")
      .update({ status: "generating_candidates" })
      .eq("id", id);

    const enhancedPrompt = await improvePrompt(prompt);
    await supabase
      .from("jobs")
      .update({ refined_prompt: enhancedPrompt })
      .eq("id", id);

    const base64Images = await generateImageCandidates(enhancedPrompt, 4);

    const candidateUrls: string[] = [];

    for (const [index, base64] of base64Images.entries()) {
      const fileName = `${id}/candidates/${index}.png`;
      const buffer = Buffer.from(base64, "base64");

      const { error } = await supabase.storage
        .from("assets")
        .upload(fileName, buffer, { contentType: "image/png", upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from("assets").getPublicUrl(fileName);
      candidateUrls.push(data.publicUrl);
    }

    await supabase
      .from("jobs")
      .update({
        status: "waiting_for_selection",
        candidate_urls: candidateUrls,
      })
      .eq("id", id);

    console.log(`[Phase 1] Candidates generated for Job ${id}`);
  } catch (error: any) {
    console.error(`[Phase 1] Failed:`, error);
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error_message: error.message,
      })
      .eq("id", id);
  }
}

export async function handleFinalization(job: any) {
  const { id, candidate_urls, selected_candidate_index } = job;
  console.log(`[Phase 2] Finalizing Job: ${id} (Selected: #${selected_candidate_index})`);

  const jobDir = path.join(WORK_DIR, id);
  await fs.ensureDir(jobDir);

  try {
    const selectedUrl = candidate_urls[selected_candidate_index];
    if (!selectedUrl) throw new Error("Invalid selection index");

    const masterPath = path.join(jobDir, "master.png");
    await downloadFile(selectedUrl, masterPath);

    const zipPath = path.join(jobDir, "assets.zip");
    await createAssetBundle(masterPath, jobDir, zipPath);

    const zipBuffer = await fs.readFile(zipPath);
    const storagePath = `${id}/assets.zip`;

    await supabase.storage
      .from("assets")
      .upload(storagePath, zipBuffer, {
        contentType: "application/zip",
        upsert: true,
      });

    const { data } = supabase.storage.from("assets").getPublicUrl(storagePath);

    await supabase
      .from("jobs")
      .update({
        status: "completed",
        zip_download_url: data.publicUrl,
      })
      .eq("id", id);

    console.log(`[Phase 2] Job ${id} Completed`);
  } catch (error: any) {
    console.error(`[Phase 2] Failed:`, error);
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error_message: error.message,
      })
      .eq("id", id);
  } finally {
    await fs.remove(jobDir);
  }
}
