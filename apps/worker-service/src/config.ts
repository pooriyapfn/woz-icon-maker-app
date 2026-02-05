import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import fs from "fs-extra";

dotenv.config();

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY!;
export const WORK_DIR = path.join(__dirname, "temp");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

fs.ensureDirSync(WORK_DIR);

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
