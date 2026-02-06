-- Add edit_prompt column for image editing feature
ALTER TABLE public.jobs ADD COLUMN edit_prompt TEXT;

-- Update status check constraint to include new statuses
ALTER TABLE public.jobs DROP CONSTRAINT jobs_status_check;

ALTER TABLE public.jobs ADD CONSTRAINT jobs_status_check
CHECK (status IN (
  'pending',
  'generating_candidates',
  'waiting_for_selection',
  'waiting_for_edit_decision',
  'editing_image',
  'processing_final',
  'completed',
  'failed'
));
