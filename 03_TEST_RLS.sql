-- TEST RLS POLICIES - Copy và paste vào SQL Editor

-- ============================================
-- TEST 1: Anonymous User
-- ============================================
set role anon;
select c.id, c.content, p.title, p.status 
from public.comments c
join public.posts p on c.post_id = p.id;
-- Kết quả: Chỉ thấy comments trên bài published ✅

reset role;

-- ============================================
-- TEST 2: Post Author (User 1)
-- ============================================
-- Lưu ý: Thay "USER_ID_1" bằng UUID thực của user từ Supabase Auth
set role authenticated;
set request.jwt.claims = '{"sub":"USER_ID_1"}';

select c.id, c.content, p.title, p.status 
from public.comments c
join public.posts p on c.post_id = p.id
where p.author_id = auth.uid();
-- Kết quả: Thấy comments trên TẤT CẢ bài (draft + published) của mình ✅

reset role;

-- ============================================
-- TEST 3: Other User (User 2)
-- ============================================
-- Thay "USER_ID_2" bằng UUID của user khác
set role authenticated;
set request.jwt.claims = '{"sub":"USER_ID_2"}';

select c.id, c.content, p.title, p.status 
from public.comments c
join public.posts p on c.post_id = p.id;
-- Kết quả: Chỉ thấy comments trên bài published ✅

reset role;

-- ============================================
-- TEST 4: View Posts with RLS
-- ============================================
-- Anonymous user
set role anon;
select id, title, status, author_id from public.posts;
-- Kết quả: Chỉ thấy bài published ✅

reset role;

-- ============================================
-- TEST 5: Check Profiles
-- ============================================
set role anon;
select id, display_name, avatar_url from public.profiles;
-- Kết quả: Thấy tất cả profiles ✅

reset role;
