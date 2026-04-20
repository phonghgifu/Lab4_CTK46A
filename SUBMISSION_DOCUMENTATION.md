# 📋 TÀI LIỆU NỘP LAB 4

## Các Công Nghệ Mới Trong Phát Triển Phần Mềm

**Student ID:** 2212440  
**Course:** CNPTM (Công nghệ phần mềm)  
**Date:** April 20, 2026  
**Status:** ✅ Hoàn thành 100%

---

## 📚 Tài Liệu Được Nộp

### 1. **PROMPTS_GUIDE.md** ⭐ (Quan trọng nhất)
Tài liệu chi tiết về tất cả các **prompts mẫu** và **hướng dẫn sử dụng** khi thực hiện Lab 4.

**Nội dung:**
- 📍 Prompts khởi tạo dự án
- 🔐 Prompts authentication
- 📝 Prompts CRUD operations
- 💬 Prompts comments & realtime
- ⭐ Prompts advanced features (Like, Search, Profile, Image Upload)
- 🐛 Prompts debugging & fixes
- 🎨 Prompts UI/UX design
- 🔄 Workflow ứng dụng chi tiết
- 💡 Best practices sử dụng prompts
- 🎯 Common prompts patterns

**Cách sử dụng:**
```
Khi cần thực hiện tính năng, tham khảo PROMPTS_GUIDE.md để:
1. Tìm prompt phù hợp
2. Tùy chỉnh theo nhu cầu
3. Gửi cho AI assistant
4. Implement theo hướng dẫn
```

---

## 🚀 Tính Năng Đã Implement

### ✅ Phần 1-2: Authentication (Xác thực)
- [x] Email/Password login
- [x] User registration
- [x] GitHub OAuth integration
- [x] Password reset flow with OTP
- [x] Route protection with middleware
- [x] Row Level Security (RLS) policies

### ✅ Phần 3-4: Database & CRUD
- [x] PostgreSQL schema design
- [x] 4 tables: profiles, posts, comments, likes
- [x] 12 RLS policies for security
- [x] Full CRUD operations for posts
- [x] Author-post relationship
- [x] Automatic slug generation

### ✅ Phần 5: Blog Display
- [x] Homepage with published posts list
- [x] Pagination (3 posts per page)
- [x] Post detail page with slug routing
- [x] Featured image display
- [x] Author info display with avatar
- [x] Post timestamps

### ✅ Phần 6: Comments
- [x] Comment submission form
- [x] Comment list display
- [x] Real-time comment updates (Supabase subscriptions)
- [x] Author info in comments
- [x] Comment timestamps

### ✅ Phần 7: Advanced Features
#### 7.1 Profile Page
- [x] View user profile (email, ID, member since)
- [x] Edit display name & avatar URL
- [x] Avatar preview
- [x] Update profile in database

#### 7.2 Like Functionality
- [x] Like/Unlike posts
- [x] Like counter display
- [x] Prevent duplicate likes (UNIQUE constraint)
- [x] Authentication check
- [x] Real-time like updates

#### 7.3 Image Upload
- [x] Upload to Supabase Storage
- [x] File validation (type, size)
- [x] Image preview before save
- [x] Store image_url in database
- [x] Display featured images

#### 7.4 Search Functionality
- [x] Full-text search with PostgreSQL RPC function
- [x] Search in title, excerpt, content
- [x] Search bar in header
- [x] /search page with results
- [x] Pagination for results
- [x] Highlight matching text

---

## 🏗️ Cấu Trúc Dự Án

```
simple-blog/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Tailwind CSS
│   │   ├── login/page.tsx              # Login page
│   │   ├── register/page.tsx           # Register page
│   │   ├── forgot-password/page.tsx    # Forgot password
│   │   ├── reset-password/page.tsx     # Reset password
│   │   ├── profile/page.tsx            # User profile
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Dashboard
│   │   │   ├── new/page.tsx            # Create post
│   │   │   └── edit/[id]/page.tsx      # Edit post
│   │   ├── posts/[slug]/page.tsx       # Post detail
│   │   ├── search/page.tsx             # Search results
│   │   └── actions/
│   │       └── auth.ts                 # Auth server actions
│   ├── components/
│   │   ├── header.tsx                  # Navigation header
│   │   ├── dashboard/
│   │   │   ├── post-form.tsx           # Create/Edit form
│   │   │   ├── post-list.tsx           # Posts list
│   │   │   └── delete-post-button.tsx  # Delete button
│   │   ├── posts/
│   │   │   ├── comment-form.tsx        # Comment input
│   │   │   ├── comment-list.tsx        # Comments display
│   │   │   ├── realtime-comments.tsx   # Real-time updates
│   │   │   ├── like-button.tsx         # Like button
│   │   │   ├── image-upload.tsx        # Image uploader
│   │   ├── profile/
│   │   │   └── profile-form.tsx        # Profile editor
│   │   └── search/
│   │       └── search-form.tsx         # Search bar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Client SDK
│   │   │   ├── server.ts               # Server SDK
│   │   │   ├── middleware.ts           # Auth middleware
│   │   │   └── context.tsx             # Auth context
│   │   └── auth/
│   │       ├── types.ts                # Type definitions
│   │       └── helpers.ts              # Helper functions
│   ├── types/
│   │   └── database.ts                 # TypeScript types
│   └── middleware.ts                   # Next.js middleware
├── public/                             # Static assets
├── .env.local                          # Environment variables
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind config
├── ADD_IMAGE_URL_COLUMN.sql           # Database migration
├── PROMPTS_GUIDE.md                   # ⭐ Tài liệu prompts
└── README.md                           # Project README
```

---

## 🛠️ Stack Công Nghệ

### Frontend
- **Framework:** Next.js 16.2.4 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Turbopack

### Backend
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **ORM:** Supabase JS SDK

### DevOps
- **Version Control:** Git/GitHub
- **Hosting:** Vercel (recommended)
- **Environment:** Node.js 18+

---

## 🔒 Security Features

1. **Row Level Security (RLS)**
   - 12 policies across 3 tables
   - User can only edit own posts
   - User can only delete own comments
   - Users can only like once per post

2. **Authentication**
   - Email/Password with Supabase Auth
   - GitHub OAuth integration
   - Session-based authentication
   - Protected routes with middleware

3. **Data Validation**
   - Client-side form validation
   - Server-side data validation
   - File type & size checks
   - Email format validation

4. **Storage Security**
   - Public read access for images
   - Authenticated upload only
   - File size limits (5MB)
   - Proper bucket policies

---

## 📖 Cách Sử Dụng Tài Liệu Prompts

### Scenario 1: Thêm Tính Năng Mới
```
1. Mở PROMPTS_GUIDE.md
2. Tìm section "Prompts [Tính năng]"
3. Copy prompt mẫu
4. Tùy chỉnh theo nhu cầu
5. Gửi cho AI assistant
6. Implement theo hướng dẫn
7. Test tính năng
8. Commit changes
```

### Scenario 2: Fix Bug
```
1. Mở PROMPTS_GUIDE.md → "Prompts Debugging & Fixes"
2. Tìm bug tương tự hoặc tạo prompt theo pattern
3. Describe error + expected behavior
4. Follow troubleshooting guide
5. Implement fix
6. Test
7. Commit fix
```

### Scenario 3: Improve UI
```
1. Mở PROMPTS_GUIDE.md → "Prompts UI/UX Design"
2. Chọn component cần improve
3. Copy prompt mẫu
4. Describe desired improvements
5. Get implementation
6. Apply changes
7. Test responsiveness
8. Commit design changes
```

---

## 🎯 Workflow Tiêu Chuẩn

### Workflow: Implement Feature

```
1. READ - Đọc prompt mẫu trong PROMPTS_GUIDE.md
   ↓
2. UNDERSTAND - Hiểu yêu cầu & implementation details
   ↓
3. CUSTOMIZE - Tùy chỉnh prompt cho dự án
   ↓
4. IMPLEMENT - Code theo hướng dẫn từ AI
   ↓
5. TEST - Test feature trên browser
   ↓
6. DEBUG - Fix bugs dùng debugging prompts
   ↓
7. COMMIT - Commit changes với message rõ
   ↓
8. DOCUMENT - Update docs nếu cần
```

### Commit Message Convention

```
Format: [Type]: [Description]

Types:
- Feat: Thêm feature mới
- Fix: Fix bug
- Improve: Cải thiện code/UI
- Docs: Update documentation
- Design: UI/UX changes
- Test: Add/update tests

Examples:
- Feat: Add image upload for blog posts
- Fix: Resolve image_url database column error
- Improve: Better error handling in image upload
- Design: Redesign profile page UI
```

---

## 📊 Development Statistics

- **Total Commits:** 10+
- **Files Modified:** 30+
- **Components Created:** 15+
- **Pages Created:** 8+
- **Database Tables:** 4
- **RLS Policies:** 12
- **Lines of Code:** 2000+
- **Time Spent:** Multiple sessions

---

## ✅ Checklist Hoàn Thành

### Core Requirements
- [x] Phần 1: Authentication
- [x] Phần 2: Database & Schema
- [x] Phần 3: CRUD Operations
- [x] Phần 4: Post Listing & Pagination
- [x] Phần 5: Post Detail & Comments
- [x] Phần 6: Real-time Comments
- [x] Phần 7.1: Profile Page
- [x] Phần 7.2: Like Functionality
- [x] Phần 7.3: Image Upload
- [x] Phần 7.4: Search Functionality

### Additional
- [x] TypeScript Interfaces
- [x] Error Handling
- [x] Input Validation
- [x] RLS Security
- [x] Responsive Design
- [x] Modern UI
- [x] Git Version Control
- [x] Code Documentation

---

## 🚀 Deployment

### Steps to Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Final: Lab 4 complete"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Connect GitHub repo to Vercel
   - Set environment variables
   - Deploy

3. **Production URL:**
   ```
   https://lab4-ctkxx.vercel.app
   ```

---

## 📞 Support & Resources

### Useful Links
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Project Repository](https://github.com/phonghgifu/Lab4_CTK46A)

### Troubleshooting
- Check PROMPTS_GUIDE.md Debugging section
- Review git commit history for similar fixes
- Check Supabase logs for database errors
- Use browser DevTools for frontend issues

---

## 📝 Summary

Dự án Lab 4 đã được hoàn thành thành công với:

✅ **7 phần** yêu cầu toàn bộ được implement  
✅ **Tất cả prompts mẫu** được lưu trong PROMPTS_GUIDE.md  
✅ **Code quality** cao với TypeScript & proper error handling  
✅ **Security** được ưu tiên với RLS policies  
✅ **UI/UX** được thiết kế hiện đại với Tailwind CSS  
✅ **Documentation** đầy đủ để dễ hiểu & duy trì  

**Tài liệu này cung cấp đủ thông tin để:**
- Hiểu các tính năng đã implement
- Sử dụng các prompts mẫu cho dự án tương tự
- Debug & fix issues
- Mở rộng tính năng
- Maintain code quality

---

**Last Updated:** April 20, 2026  
**Status:** ✅ Ready for Submission  
**GitHub:** https://github.com/phonghgifu/Lab4_CTK46A
