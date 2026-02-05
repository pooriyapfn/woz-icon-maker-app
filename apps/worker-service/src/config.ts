import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import WebSocket from "ws";

(globalThis as any).WebSocket = WebSocket;

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const WORK_DIR = path.join(__dirname, "temp");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

fs.ensureDirSync(WORK_DIR);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  global: {
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  },
});
