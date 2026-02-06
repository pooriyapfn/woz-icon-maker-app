import { supabase } from "./config.js";
import { handleNewJob, handleFinalization, handleImageEdit } from "./modules/job-handlers.js";

console.log("Worker started. Listening for jobs...");

supabase
  .channel("job-orchestrator")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "jobs" },
    async (payload: { new: { status: string } }) => {
      console.log("[Realtime] INSERT:", payload.new);
      if (payload.new.status === "pending") {
        await handleNewJob(payload.new);
      }
    }
  )
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "jobs" },
    async (payload: { new: { status: string } }) => {
      console.log("[Realtime] UPDATE:", payload.new);
      if (payload.new.status === "processing_final") {
        await handleFinalization(payload.new);
      } else if (payload.new.status === "editing_image") {
        await handleImageEdit(payload.new);
      }
    }
  )
  .subscribe((status, err) => {
    if (status === "SUBSCRIBED") {
      console.log("[Realtime] Subscribed to job changes");
    } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
      console.error("[Realtime] Connection failed:", status, err?.message);
    }
  });
