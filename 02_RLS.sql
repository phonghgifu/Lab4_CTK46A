-- PART 2: ENABLE RLS AND CREATE POLICIES

-- Drop existing policies (if they exist)
drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "posts_select_published" on public.posts;
drop policy if exists "posts_select_own_draft" on public.posts;
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own" on public.posts;
drop policy if exists "posts_delete_own" on public.posts;
drop policy if exists "comments_select_published" on public.comments;
drop policy if exists "comments_author_view_on_own_posts" on public.comments;
drop policy if exists "comments_insert_own" on public.comments;
drop policy if exists "comments_delete_own" on public.comments;

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- PROFILES POLICIES
create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- POSTS POLICIES
create policy "posts_select_published" on public.posts for select using (status = 'published');
create policy "posts_select_own_draft" on public.posts for select using (auth.uid() = author_id);
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = author_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = author_id);

-- COMMENTS POLICIES
create policy "comments_select_published" on public.comments for select using (
  exists (select 1 from public.posts where posts.id = comments.post_id and posts.status = 'published')
);
create policy "comments_author_view_on_own_posts" on public.comments for select using (
  exists (select 1 from public.posts where posts.id = comments.post_id and posts.author_id = auth.uid())
);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = author_id);

-- PART 3: TEST POLICIES

-- Test 1: Anonymous User - chỉ xem được comments trên bài published
-- set role anon;
-- select c.id, c.content, p.title, p.status 
-- from public.comments c
-- join public.posts p on c.post_id = p.id;
-- Kết quả: Chỉ thấy comments trên bài published ✅

-- Test 2: Post Author - xem comments trên tất cả bài (draft + published)
-- set role authenticated;
-- set request.jwt.claims = '{"sub":"USER_ID_1"}';
-- select c.id, c.content, p.title, p.status 
-- from public.comments c
-- join public.posts p on c.post_id = p.id
-- where p.author_id = auth.uid();
-- Kết quả: Thấy comments trên TẤT CẢ bài (draft + published) của mình ✅

-- Test 3: Other User - chỉ xem được comments trên bài published
-- set role authenticated;
-- set request.jwt.claims = '{"sub":"USER_ID_2"}';
-- select c.id, c.content, p.title, p.status 
-- from public.comments c
-- join public.posts p on c.post_id = p.id;
-- Kết quả: Chỉ thấy comments trên bài published ✅

-- Reset về admin
-- reset role;
