## PHẦN 4: SUPABASE AUTHENTICATION - SETUP GUIDE

### ✅ Hoàn Thành

Tôi đã tạo xong tất cả các file cần thiết:

```
lib/auth/
├── types.ts          # TypeScript types
├── helpers.ts        # Auth functions (login, signUp, logout, OAuth)
├── context.tsx       # AuthProvider + useAuth hook

components/
├── navbar.tsx        # Navigation bar

app/
├── auth/
│   ├── login/page.tsx     # Login form
│   ├── register/page.tsx  # Register form
│   ├── callback/page.tsx  # OAuth callback
│   └── layout.tsx         # Auth layout with AuthProvider
├── dashboard/
│   ├── page.tsx           # Dashboard (protected)
│   └── layout.tsx         # Protected layout (redirects if not authenticated)
├── layout.tsx             # Root layout with AuthProvider
└── page.tsx               # Updated home page with navbar
```

### 🔧 Tiếp Theo: Cấu Hình OAuth (GitHub)

Để sử dụng đăng nhập qua GitHub, bạn cần:

#### Bước 1: Cấu hình GitHub OAuth trong Supabase

1. Vào **Supabase Dashboard** → **Project** → **Authentication** → **Providers**
2. Tìm **GitHub** và click vào nó
3. Chọn **Enable**
4. Bạn sẽ thấy:
   - **Client ID**
   - **Client Secret**

#### Bước 2: Đăng ký ứng dụng trên GitHub

1. Vào https://github.com/settings/developers
2. Click **New OAuth App**
3. Điền thông tin:
   - **Application name**: Simple Blog
   - **Homepage URL**: http://localhost:3000
   - **Authorization callback URL**: http://localhost:3000/auth/callback
4. Copy **Client ID** và **Client Secret**
5. Paste vào Supabase (Authentication → Providers → GitHub)
6. Click **Save**

#### Bước 3: Enable OAuth redirect

Trong file [lib/auth/helpers.ts](lib/auth/helpers.ts), hàm `signInWithGitHub()` đã được cấu hình:

```typescript
redirectTo: `${window.location.origin}/auth/callback`
```

Điều này sẽ tự động redirect về `/auth/callback` sau khi GitHub xác thực thành công.

---

### 🧪 Cách Test Authentication

#### Test 1: Email/Password

1. Chạy dev server: `npm run dev`
2. Vào http://localhost:3000
3. Click **"Đăng Ký"** → Tạo tài khoản
4. Click **"Đăng Nhập"** → Đăng nhập
5. Nếu thành công → Chuyển hướng đến Dashboard

#### Test 2: Logout

1. Ở Dashboard → Click **"Đăng Xuất"**
2. Nếu thành công → Chuyển hướng về Home Page

#### Test 3: Protected Route

1. Khi chưa đăng nhập → Cố gắng vào http://localhost:3000/dashboard
2. Tự động redirect về `/auth/login`
3. Đăng nhập → Có thể vào Dashboard

#### Test 4: GitHub OAuth (khi đã cấu hình)

1. Vào http://localhost:3000/auth/login
2. Click **"Đăng nhập bằng GitHub"**
3. Redirect đến GitHub
4. Authorize ứng dụng
5. Callback về Dashboard

---

### 🐛 Troubleshooting

**Lỗi: "useAuth must be used within AuthProvider"**
- ✅ Kiểm tra root layout đã thêm `<AuthProvider>` chưa

**Lỗi: RLS policy violations**
- ✅ Chạy SQL RLS_POLICIES.sql trước

**OAuth redirect không hoạt động**
- ✅ Cấu hình Supabase OAuth settings đúng
- ✅ Callback URL phải khớp: `http://localhost:3000/auth/callback`

---

### 📋 Checklist Hoàn Thành

- ✅ Database schema đã tạo (CLEAN_SCHEMA.sql)
- ✅ RLS policies đã tạo (RLS_POLICIES.sql)
- ✅ Auth pages đã tạo (login, register)
- ✅ Protected routes đã tạo (dashboard)
- ✅ Navbar hiển thị trạng thái auth
- ⏳ OAuth cấu hình (cần setup GitHub)

---

### 🎯 Bước Tiếp Theo

Phần 5 sẽ bao gồm:
1. CRUD operations cho Posts (Create, Read, Update, Delete)
2. Server Actions để tạo/sửa/xóa bài viết
3. Post listing page
4. Post detail page với comments

Ready? Let's go! 🚀
