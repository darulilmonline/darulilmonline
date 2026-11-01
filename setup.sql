-- দারুল ইলম অনলাইন — ভর্তির আবেদন টেবিল
create table if not exists public.applications (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  student_name text not null,
  age int,
  guardian_name text,
  phone text not null,
  course text not null,
  plan text,
  preferred_time text,
  note text,
  status text not null default 'new'
);

alter table public.applications enable row level security;

-- যে কেউ (ওয়েবসাইট থেকে) আবেদন জমা দিতে পারবে
create policy "anyone can apply" on public.applications
  for insert to anon with check (true);

-- শুধু লগইন করা অ্যাডমিন দেখতে ও আপডেট করতে পারবে
create policy "admin can read" on public.applications
  for select to authenticated using (true);
create policy "admin can update" on public.applications
  for update to authenticated using (true);
create policy "admin can delete" on public.applications
  for delete to authenticated using (true);
