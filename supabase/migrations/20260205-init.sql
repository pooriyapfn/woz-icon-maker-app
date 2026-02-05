create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt text not null,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  master_image_url text,
  zip_download_url text,
  error_message text
);
alter publication supabase_realtime add table jobs;


insert into storage.buckets (id, name, public) values ('assets', 'assets', true);

create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'assets' );

create policy "Authenticated Uploads"
on storage.objects for insert
with check ( bucket_id = 'assets' );