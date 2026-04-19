-- BÀI TẬP 3.1: Test Policy - Post Author xem Comments trên Draft Posts

-- ============================================
-- SETUP: Tạo dữ liệu test
-- ============================================
-- (Chạy từng cái để tạo dữ liệu)

-- ⚠️ QUAN TRỌNG: Thay UUID bằng giá trị thực từ Supabase Dashboard!
-- Bước:
-- 1. Vào Supabase → Authentication → Users
-- 2. Click User 1 (phong@gmail.com) → Copy UID từ right panel
-- 3. Replace 'USER_ID_1_HERE' bằng UUID đó

-- 0. Tạo profiles cho 2 users (nếu chưa có)
INSERT INTO public.profiles (id, display_name) 
VALUES 
  ('e1a4a0dd-330e-4779-a55a-73151d36dfd6', 'User 1 - Phong')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, display_name) 
VALUES 
  ('96420f57-fb6e-46a6-baf0-0dba3847b767', 'User 2 - Phong Cicho')
ON CONFLICT (id) DO NOTHING;

-- 1. Tạo bài viết draft của User 1
INSERT INTO public.posts (author_id, title, content, status) 
VALUES (
  'e1a4a0dd-330e-4779-a55a-73151d36dfd6', -- User 1: phong@gmail.com
  'Bài draft của tôi',
  'Nội dung bài draft',
  'draft'
);

-- 2. Tạo comment trên bài draft đó
INSERT INTO public.comments (post_id, author_id, content)
SELECT 
  p.id,
  '96420f57-fb6e-46a6-baf0-0dba3847b767', -- User 2: phongcicho@gmail.com
  'Comment từ User 2 trên bài draft'
FROM public.posts p
WHERE p.author_id = 'e1a4a0dd-330e-4779-a55a-73151d36dfd6'
  AND p.status = 'draft'
LIMIT 1;

-- ============================================
-- TEST 1: User 1 (Author) xem comments trên bài draft của mình
-- ============================================
-- Kỳ vọng: Thấy comment ✅
set role authenticated;
set request.jwt.claims = '{"sub":"e1a4a0dd-330e-4779-a55a-73151d36dfd6"}';

SELECT 
  c.id,
  c.content,
  c.author_id,
  p.title,
  p.status,
  p.author_id as post_author_id
FROM public.comments c
JOIN public.posts p ON c.post_id = p.id
WHERE p.status = 'draft';

-- Kết quả mong muốn:
-- Nên thấy bài "Bài draft của tôi" với comment từ User 2 ✅

reset role;

-- ============================================
-- TEST 2: User 2 (không phải author) xem comment trên bài draft
-- ============================================
-- Kỳ vọng: KHÔNG thấy comment (bài draft bị ẩn) ❌
set role authenticated;
set request.jwt.claims = '{"sub":"96420f57-fb6e-46a6-baf0-0dba3847b767"}';

SELECT 
  c.id,
  c.content,
  c.author_id,
  p.title,
  p.status
FROM public.comments c
JOIN public.posts p ON c.post_id = p.id
WHERE p.status = 'draft';

-- Kết quả mong muốn: 
-- Không hiện bất cứ dòng nào (RLS chặn) ✅

reset role;

-- ============================================
-- TEST 3: Anonymous xem comment trên bài draft
-- ============================================
-- Kỳ vọng: KHÔNG thấy gì ❌
set role anon;

SELECT 
  c.id,
  c.content,
  p.title,
  p.status
FROM public.comments c
JOIN public.posts p ON c.post_id = p.id
WHERE p.status = 'draft';

-- Kết quả mong muốn:
-- Không hiện bất cứ dòng nào ✅

reset role;

-- ============================================
-- TEST 4: Chi tiết - Xem policy hoạt động
-- ============================================
-- Kiểm tra logic của policy "comments_author_view_on_own_posts"
set role authenticated;
set request.jwt.claims = '{"sub":"e1a4a0dd-330e-4779-a55a-73151d36dfd6"}';

SELECT 
  c.id,
  c.content,
  c.post_id,
  p.id as post_id,
  p.author_id as post_author,
  p.status,
  auth.uid() as current_user,
  (p.author_id = auth.uid()) as is_author
FROM public.comments c
JOIN public.posts p ON c.post_id = p.id;

-- Kết quả mong muốn:
-- is_author = true → Policy cho phép xem ✅

reset role;

-- ============================================
-- CLEANUP: Xóa dữ liệu test (nếu cần)
-- ============================================
-- DELETE FROM public.comments 
-- WHERE content = 'Comment từ User 2 trên bài draft';
-- DELETE FROM public.posts 
-- WHERE title = 'Bài draft của tôi';
