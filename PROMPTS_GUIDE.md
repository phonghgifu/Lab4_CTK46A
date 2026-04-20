# Lab 4 - Các Prompt Mẫu và Hướng Dẫn Sử Dụng

## 📋 Mục Lục
1. [Prompts Khởi Tạo Dự Án](#1-prompts-khởi-tạo-dự-án)
2. [Prompts Tính Năng Authentication](#2-prompts-tính-năng-authentication)
3. [Prompts CRUD Blog Posts](#3-prompts-crud-blog-posts)
4. [Prompts Comments & Realtime](#4-prompts-comments--realtime)
5. [Prompts Advanced Features](#5-prompts-advanced-features)
6. [Prompts Debugging & Fixes](#6-prompts-debugging--fixes)
7. [Prompts UI/UX Design](#7-promptsuxdesign)

---

## 1. Prompts Khởi Tạo Dự Án

### Prompt 1.1: Tạo Next.js Project với Supabase
```
Create a new Next.js 16 project with TypeScript, Tailwind CSS, and ESLint.
Set up Supabase integration for PostgreSQL database.
Configure environment variables for Supabase URL and API keys.
```

**Kết quả mong đợi:**
- ✅ Next.js project structure với src/ folder
- ✅ Supabase client setup
- ✅ TypeScript configurations
- ✅ .env.local file cho credentials

---

### Prompt 1.2: Tạo Database Schema
```
Create PostgreSQL schema for blog application:
- profiles table: id, display_name, avatar_url, created_at, updated_at
- posts table: id, author_id, title, slug, content, excerpt, image_url, status, published_at, created_at, updated_at
- comments table: id, post_id, author_id, content, created_at
- likes table: id, post_id, user_id, created_at (UNIQUE constraint)

Add Row Level Security (RLS) policies for all tables.
```

**Kết quả mong đợi:**
- ✅ Tables với constraints đúng
- ✅ 12 RLS policies
- ✅ Relationships giữa tables

---

## 2. Prompts Tính Năng Authentication

### Prompt 2.1: Email & Password Authentication
```
Create authentication pages:
- Login page with email/password form
- Register page with validation
- Forgot password page with OTP flow
- Reset password page

Use Supabase Auth API.
Add redirect middleware for protected routes.
```

**Key Features:**
- Email validation
- Password requirements
- Error handling
- Session management

---

### Prompt 2.2: GitHub OAuth Integration
```
Add GitHub OAuth provider to login page:
- Generate GitHub OAuth credentials
- Configure redirect URL
- Add "Login with GitHub" button
- Handle OAuth callback

Use Supabase Auth providers.
```

**Cấu hình:**
```env
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
```

---

## 3. Prompts CRUD Blog Posts

### Prompt 3.1: Create Post Page
```
Create dashboard/new page:
- Form fields: title, content, excerpt, status (draft/published), image upload
- Auto-generate slug from title
- Handle image upload to Supabase Storage
- Save to database with author_id
- Redirect to dashboard on success
```

**Form Fields:**
- Title (required)
- Content (required, textarea)
- Excerpt (optional)
- Image (optional)
- Status (draft/published)

---

### Prompt 3.2: Edit Post Page
```
Create dashboard/edit/[id] page:
- Load existing post data
- Allow editing all fields
- Check post ownership
- Show delete confirmation
- Update database on submit
- Show success/error messages
```

**Validations:**
- ✅ Check user is authenticated
- ✅ Check user owns the post
- ✅ Validate form inputs
- ✅ Handle upload errors

---

### Prompt 3.3: Post Listing & Pagination
```
Create homepage with:
- List all published posts
- Show post title, excerpt, author, date
- Display featured image if available
- Implement pagination (3 posts per page)
- Add links to post detail pages
- Show author info from profiles table
```

**Database Query:**
```sql
SELECT *,
  profiles(display_name, avatar_url)
FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 3 OFFSET {page * 3}
```

---

### Prompt 3.4: Post Detail Page
```
Create posts/[slug] page:
- Fetch post by slug
- Show full content with featured image
- Display author info and date
- Show related comments section
- Add Like button
- Show comment form and list
```

---

## 4. Prompts Comments & Realtime

### Prompt 4.1: Comments System
```
Create comment components:
1. CommentForm: Submit new comment (client component)
2. CommentList: Display all comments (server component)
3. RealtimeComments: Subscribe to new comments (client component)

Features:
- Realtime updates using Supabase subscriptions
- Show author name and avatar from profiles
- Display timestamps
- Handle empty states
```

**Implementation:**
```typescript
// Realtime subscription
const channel = supabase
  .channel('comments-channel')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'comments' },
    (payload) => { /* handle new comment */ }
  )
  .subscribe()
```

---

### Prompt 4.2: Realtime Updates
```
Implement Supabase real-time features:
- Subscribe to new comments on post detail page
- Show new comments without page refresh
- Update comment count in real-time
- Handle connection errors gracefully
- Clean up subscriptions on unmount
```

---

## 5. Prompts Advanced Features

### Prompt 5.1: Like Functionality (Bài 7.2)
```
Create Like button component:
- Show like count for each post
- Toggle like/unlike on click
- Only allow authenticated users (redirect to login if needed)
- Use database transactions to prevent duplicates
- Show visual feedback (❤️ emoji)
- Add RLS policy to prevent unauthorized likes

Database:
- Add likes table with unique(post_id, user_id) constraint
- Add RLS policies for SELECT, INSERT, DELETE
```

**Component Features:**
- ✅ Like count display
- ✅ Toggle like/unlike
- ✅ Authentication check
- ✅ Real-time updates

---

### Prompt 5.2: Image Upload (Bài 7.3)
```
Create ImageUpload component:
- Accept image files (JPG, PNG, GIF)
- Validate file size (max 5MB)
- Show preview before upload
- Upload to Supabase Storage bucket 'blog-images'
- Return public URL
- Handle errors gracefully

Features:
- Drag & drop support (optional)
- Progress indicator
- Error messages
- Cancel upload option
```

**Storage Setup:**
```
Bucket: blog-images
Folder: posts/
Public: Yes
Max size: 5MB
```

---

### Prompt 5.3: Search Functionality (Bài 7.4)
```
Create search feature:
1. Create search_posts() PostgreSQL function:
   - Full-text search on title, excerpt, content
   - Prioritize title matches
   - Only show published posts

2. Create /search page:
   - Search form with input field
   - Display search results
   - Show featured images
   - Highlight matching text
   - Pagination for results

3. Add search bar to header:
   - Quick search input
   - Submit form to /search page
```

**PostgreSQL Function:**
```sql
CREATE FUNCTION search_posts(search_query TEXT)
RETURNS TABLE(...) AS $$
SELECT * FROM posts
WHERE status = 'published'
AND (title ILIKE '%query%' OR content ILIKE '%query%')
ORDER BY published_at DESC
$$ LANGUAGE SQL;
```

---

### Prompt 5.4: Profile Page (Bài 7.1)
```
Create profile page at /profile:
- Show user info: email, ID, member since date
- Display avatar preview
- Edit form for display_name and avatar_url
- Update profile in database
- Show success/error messages
- Protect route (redirect to login if not authenticated)
```

**Features:**
- ✅ View profile info
- ✅ Edit display name
- ✅ Change avatar URL
- ✅ Real-time preview
- ✅ Success notifications

---

## 6. Prompts Debugging & Fixes

### Prompt 6.1: Fix Import Path Issues
```
Problem: "Cannot find module '@/lib/supabase/server'"

Solution:
1. Move /lib folder to /src/lib
2. Update tsconfig.json paths:
   "@/*": ["./src/*"]
   (Remove @lib alias)
3. Replace all @lib/ imports with @/lib/
4. Clear .next cache and restart dev server
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Prompt 6.2: Fix Database Schema Issues
```
Problem: Column 'p.image_url' does not exist

Solution:
1. Run migration SQL:
   ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;

2. Update search_posts() function:
   DROP FUNCTION search_posts(text);
   CREATE FUNCTION search_posts(...) ...

3. Add storage policies for image upload
```

---

### Prompt 6.3: Fix Storage Bucket Issues
```
Problem: "Bucket not found" error

Solution:
1. Create storage bucket 'blog-images'
2. Set bucket to PUBLIC
3. Add storage policies:
   - Policy for SELECT (public access)
   - Policy for INSERT (authenticated users)
   - Policy for DELETE (own files)
```

**SQL for Policies:**
```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'authenticated'
);
```

---

## 7. Prompts UI/UX Design

### Prompt 7.1: Modern Dashboard UI
```
Redesign dashboard page:
- Create card-based layout for post list
- Show featured image thumbnail
- Display author info with avatar
- Add publish/draft status badge
- Edit and delete action buttons
- Responsive grid layout
- Add "New Post" button
- Sort by date (newest first)
```

**Tailwind Classes:**
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `bg-white rounded-lg shadow-md border border-gray-200`
- `hover:shadow-lg transition-shadow`

---

### Prompt 7.2: Modern Profile Page
```
Redesign profile page with:
- Gradient background (blue to slate)
- Sticky sidebar with account info
- Avatar preview with larger display
- Improved form styling
- Better alerts with icons
- Professional typography
- Smooth transitions and hover effects
```

**Design Elements:**
- Background: `bg-gradient-to-br from-slate-50 to-slate-100`
- Cards: `bg-white rounded-xl shadow-sm border border-gray-100`
- Buttons: `bg-gradient-to-r from-blue-600 to-blue-700`

---

### Prompt 7.3: Improve Image Upload Component
```
Enhance image upload UI:
- Better error messages with icons
- Loading state with spinner
- Preview with border and shadow
- Help text for file requirements
- Drag & drop support (optional)
- Better accessibility labels
```

**Error Handling:**
```
- Show error icon
- Display specific error message
- Suggest solutions (login, file size, format)
- Log errors to console for debugging
```

---

## 📊 Workflow Aplikasi

### User Flow: Create & Publish Post
```
1. User clicks "Tạo bài viết mới"
   ↓
2. Redirects to /dashboard/new (if not authenticated → /login)
   ↓
3. Fill form: title, content, excerpt, image
   ↓
4. Select status: draft or published
   ↓
5. Click "Lưu bài viết"
   ↓
6. Server validates and saves to database
   ↓
7. Redirect to /dashboard with success message
   ↓
8. Post appears on homepage if published
```

### User Flow: Like a Post
```
1. User views post at /posts/[slug]
   ↓
2. Clicks ❤️ Like button
   ↓
3. Check if authenticated (if not → redirect to /login)
   ↓
4. Check if already liked (prevent duplicates)
   ↓
5. Insert/Delete from likes table
   ↓
6. Update like count display
   ↓
7. Real-time update for all viewers
```

### User Flow: Search Posts
```
1. User enters search query in header search bar
   ↓
2. Submit form → navigate to /search?q=query
   ↓
3. Server calls search_posts() RPC function
   ↓
4. Highlight matching text in results
   ↓
5. Show featured images and author info
   ↓
6. Pagination for multiple pages of results
```

---

## 🔧 Troubleshooting Prompts

### Khi gặp lỗi TypeScript:
```
"Problem: Type 'unknown' is not assignable to type 'string'"

Solution:
- Add proper type annotations
- Use 'as string' for type assertion (carefully)
- Check API response types from Supabase
- Add null checks before using values
```

---

### Khi gặp lỗi Database:
```
"Problem: RLS policy blocked the operation"

Solution:
1. Check if user is authenticated
2. Check RLS policy conditions
3. Verify user_id matches in database
4. Test with service_role key (bypasses RLS)
5. Review Supabase logs for detailed error
```

---

### Khi gặp lỗi Next.js:
```
"Problem: [Fast Refresh] error"

Solution:
1. Delete .next folder: rm -r .next
2. Restart dev server: npm run dev
3. Check for syntax errors in files
4. Clear browser cache (Cmd+Shift+Del)
5. Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
```

---

## 📝 Best Practices Sử Dụng Prompts

1. **Be Specific**: Mô tả rõ ràng những gì bạn muốn làm
   ```
   ❌ "Tạo form"
   ✅ "Tạo form login với email/password validation"
   ```

2. **Include Requirements**: Liệt kê chi tiết các yêu cầu
   ```
   - Fields: email, password
   - Validation: email format, min 8 chars password
   - Error handling: show messages
   - Success: redirect to dashboard
   ```

3. **Provide Context**: Cho biết ngữ cảnh dự án
   ```
   "Building a blog app with Supabase and Next.js.
   Need to create authentication system with RLS policies."
   ```

4. **Ask for Explanations**: Khi không hiểu
   ```
   "Why use RLS policies instead of checking in code?"
   "How does real-time subscription work?"
   ```

---

## 🎯 Common Prompts Pattern

### Pattern 1: Feature Implementation
```
Create [Component/Page] that:
- Does [specific task]
- With [specific features]
- Using [specific technology]
- Handle [edge cases]
- Show [error states]
```

### Pattern 2: Bug Fixing
```
Problem: [error message or behavior]
Location: [file/page where it occurs]
Expected: [what should happen]
Actual: [what currently happens]

Possible causes:
- [potential issue 1]
- [potential issue 2]
```

### Pattern 3: Performance/Security
```
Optimize [component/feature] for:
- Performance: [specific metric]
- Security: [specific concern]
- UX: [user experience improvement]
- Accessibility: [a11y requirement]
```

---

## 📚 Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/sql-createrls.html)
- [React Best Practices](https://react.dev)

---

**Tài liệu này được tạo ra trong quá trình hoàn thành Lab 4 - Các công nghệ mới trong phát triển phần mềm**

Date: April 20, 2026
Status: ✅ Hoàn thành
Commits: 10+ commits
Repository: https://github.com/phonghgifu/Lab4_CTK46A
