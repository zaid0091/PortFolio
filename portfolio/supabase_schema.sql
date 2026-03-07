-- 1. Create Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date text not null,
  description text not null,
  icon text not null,
  icon_bg text not null,
  tags text[] not null default '{}',
  bullets text[] not null default '{}',
  github_url text,
  live_url text,
  detail_overview text not null,
  detail_problem text not null,
  detail_solution text not null,
  detail_tech text[] not null default '{}',
  detail_features text[] not null default '{}',
  detail_lessons text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Blogs Table
create table public.blogs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date text not null,
  summary text not null,
  content text not null,
  tags text[] not null default '{}',
  color text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Set up Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.blogs enable row level security;

-- Allow public read access (everyone can see portfolios and blogs)
create policy "Public can view projects"
  on public.projects for select using (true);

create policy "Public can view blogs"
  on public.blogs for select using (true);

create policy "Public can insert projects"
  on public.projects for insert with check (true);

create policy "Public can insert blogs"
  on public.blogs for insert with check (true);

-- Allow authenticated users to insert/update/delete 
create policy "Authenticated users can manage projects"
  on public.projects for all using (auth.role() = 'authenticated');

create policy "Authenticated users can manage blogs"
  on public.blogs for all using (auth.role() = 'authenticated');
