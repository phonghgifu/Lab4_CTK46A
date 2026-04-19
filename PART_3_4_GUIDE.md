## PHẦN 3: ROW LEVEL SECURITY (RLS)

### 3.1. RLS là gì?

**Row Level Security (RLS)** là cơ chế bảo vệ dữ liệu ở cấp độ database. Nó kiểm soát:
- **Ai** có thể xem dữ liệu nào
- **Ai** có thể chỉnh sửa, xóa dữ liệu nào

Vì có RLS, khi frontend gọi Supabase API, chỉ dữ liệu được phép mới được trả lại.

### 3.2. Thi hành RLS Policies

**Bước 1:** Copy toàn bộ SQL từ file [RLS_POLICIES.sql](RLS_POLICIES.sql)

**Bước 2:** Vào Supabase Dashboard → SQL Editor → New Query

**Bước 3:** Paste code RLS vào và click "Run"

### 3.3. Giải thích Policies

#### PROFILES:
- ✅ **Public read**: Mọi người xem được profile
- 🔒 **Own update**: Chỉ user themselves mới chỉnh sửa được profile

#### POSTS:
- ✅ **Published read**: Mọi người xem bài published
- 🔒 **Own draft read**: User xem được bài draft của mình
- 🔒 **Own CRUD**: User chỉ create, update, delete bài của mình

#### COMMENTS:
- ✅ **Published read**: Mọi người xem bình luận trên bài published
- 🔒 **Own draft read**: User xem bình luận trên bài draft của mình
- 🔒 **Auth create**: Chỉ user đã đăng nhập mới bình luận được
- 🔒 **Own delete**: User xóa được bình luận của mình

### 3.4. Kiểm tra RLS

Sau khi chạy SQL:

1. Vào **Authentication** → **Policies** để xem danh sách
2. Click vào mỗi bảng để xem chi tiết policies

✅ Kết quả: Bạn sẽ thấy các policies cho 3 bảng

---

## PHẦN 4: SUPABASE AUTHENTICATION

Phần này sẽ tích hợp:
1. ✅ Email/Password Authentication
2. ✅ OAuth (GitHub)
3. ✅ Protected Routes
4. ✅ Auth Context

### 4.1. Các file cần tạo

Chúng ta sẽ tạo:
```
lib/auth/
├── client.ts (Auth context cho client)
├── types.ts (TypeScript types)
└── helpers.ts (Utility functions)

app/
├── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx
├── (protected)/
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   └── layout.tsx (middleware protect)
```

---

✅ **Tiếp tục bước nào bạn?**
1. Chạy RLS_POLICIES.sql trước
2. Sau đó tôi sẽ tạo Authentication components
