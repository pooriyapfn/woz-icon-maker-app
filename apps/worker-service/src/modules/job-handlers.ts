import path from "path";
import fs from "fs-extra";
import { supabase, WORK_DIR } from "../config.js";
import { improvePrompt } from "../agents/prompt-enhancer.js";
import { generateImageCandidates } from "../agents/image-generator.js";
import { editImage } from "../agents/image-editor.js";
import { createAssetBundle } from "./processor.js";
import { downloadFile, downloadAsBase64 } from "../utils/download.js";

export async function handleNewJob(job: any) {
  const { id, prompt, logo_url } = job;
  console.log(`[Phase 1] New Job: ${id}`);

  try {
    await supabase
      .from("jobs")
      .update({ status: "generating_candidates" })
      .eq("id", id);

    const enhancedPrompts = await improvePrompt(prompt, 4, !!logo_url);

    const logoBase64 = logo_url ? await downloadAsBase64(logo_url) : undefined;
    const base64Images = await generateImageCandidates(
      enhancedPrompts,
      logoBase64,
    );

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
  console.log(
    `[Phase 2] Finalizing Job: ${id} (Selected: #${selected_candidate_index})`,
  );

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

    await supabase.storage.from("assets").upload(storagePath, zipBuffer, {
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

export async function handleImageEdit(job: any) {
  const { id, candidate_urls, selected_candidate_index, edit_prompt } = job;
  console.log(`[Image Edit] Editing Job: ${id}`);

  try {
    const selectedUrl = candidate_urls[selected_candidate_index];
    if (!selectedUrl) throw new Error("Invalid selection index");
    if (!edit_prompt) throw new Error("Missing edit prompt");

    const sourceBase64 = await downloadAsBase64(selectedUrl);
    const editedBase64 = await editImage(sourceBase64, edit_prompt);

    const fileName = `${id}/candidates/${selected_candidate_index}.png`;
    const buffer = Buffer.from(editedBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("assets")
      .upload(fileName, buffer, { contentType: "image/png", upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("assets").getPublicUrl(fileName);
    const newCandidateUrls = [...candidate_urls];
    newCandidateUrls[selected_candidate_index] =
      `${data.publicUrl}?t=${Date.now()}`;

    await supabase
      .from("jobs")
      .update({
        status: "waiting_for_edit_decision",
        candidate_urls: newCandidateUrls,
        edit_prompt: null,
      })
      .eq("id", id);

    console.log(`[Image Edit] Edit completed for Job ${id}`);
  } catch (error: any) {
    console.error(`[Image Edit] Failed:`, error);
    await supabase
      .from("jobs")
      .update({
        status: "failed",
        error_message: error.message,
      })
      .eq("id", id);
  }
}
