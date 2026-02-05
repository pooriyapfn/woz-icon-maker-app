import { supabase } from "./config.js";
import { handleNewJob, handleFinalization } from "./modules/job-handlers.js";

console.log("Worker started. Listening for jobs...");

supabase
  .channel("job-orchestrator")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "jobs" },
    async (payload: { new: { status: string } }) => {
      if (payload.new.status === "pending") {
        await handleNewJob(payload.new);
      }
    }
  )
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "jobs" },
    async (payload: { new: { status: string } }) => {
      if (payload.new.status === "processing_final") {
        await handleFinalization(payload.new);
      }
    }
  )
  .subscribe();
