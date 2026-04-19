-- ============================================================
-- PHẦN 3: ROW LEVEL SECURITY (RLS) POLICIES
-- Chạy những lệnh này sau khi schema đã được tạo
-- ============================================================

-- Drop enum if exists để tránh conflict
drop type if exists public.post_status cascade;

-- Tạo enum post_status
create type public.post_status as enum ('draft', 'published');

-- ============================================================
-- 1. ENABLE RLS TRÊN TẤT CẢ CÁC BẢNG
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;

-- ============================================================
-- 2. POLICIES CHO BẢNG PROFILES
-- ============================================================

-- Policy: Mọi người có thể xem profile công khai
create policy "Public profiles are viewable by everyone"
on public.profiles for select
using (true);

-- Policy: User chỉ có thể cập nhật profile của mình
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Policy: User chỉ có thể insert profile của mình (không cần vì trigger xử lý)
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

-- ============================================================
-- 3. POLICIES CHO BẢNG POSTS
-- ============================================================

-- Policy: Mọi người có thể xem bài viết published
create policy "Published posts are viewable by everyone"
on public.posts for select
using (status = 'published'::post_status);

-- Policy: Người dùng có thể xem bài viết draft của chính mình
create policy "Users can view their own draft posts"
on public.posts for select
using (auth.uid() = author_id);

-- Policy: Người dùng có thể tạo bài viết
create policy "Users can create posts"
on public.posts for insert
with check (auth.uid() = author_id);

-- Policy: Người dùng chỉ có thể cập nhật bài viết của mình
create policy "Users can update their own posts"
on public.posts for update
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

-- Policy: Người dùng chỉ có thể xóa bài viết của mình
create policy "Users can delete their own posts"
on public.posts for delete
using (auth.uid() = author_id);

-- ============================================================
-- 4. POLICIES CHO BẢNG COMMENTS
-- ============================================================

-- Policy: Mọi người có thể xem bình luận trên bài published
create policy "Comments on published posts are viewable"
on public.comments for select
using (
  exists (
    select 1 from public.posts
    where posts.id = comments.post_id
    and posts.status = 'published'::post_status
  )
);

-- Policy: User có thể xem bình luận trên bài draft của mình
create policy "Users can view comments on their draft posts"
on public.comments for select
using (
  exists (
    select 1 from public.posts
    where posts.id = comments.post_id
    and posts.author_id = auth.uid()
  )
);

-- Policy: User đã đăng nhập có thể tạo bình luận
create policy "Authenticated users can create comments"
on public.comments for insert
with check (auth.uid() = author_id);

-- Policy: User chỉ có thể xóa bình luận của mình
create policy "Users can delete their own comments"
on public.comments for delete
using (auth.uid() = author_id);

-- ============================================================
-- HOÀN THÀNH RLS POLICIES
-- ============================================================
