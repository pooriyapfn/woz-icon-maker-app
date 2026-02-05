alter table public.jobs 
add column refined_prompt text,
add column candidate_urls text[],
add column selected_candidate_index int;

alter table public.jobs 
drop constraint jobs_status_check;

alter table public.jobs 
add constraint jobs_status_check 
check (status in (
  'pending',              
  'generating_candidates',
  'waiting_for_selection',
  'processing_final',     
  'completed',            
  'failed'
));