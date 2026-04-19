import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const samplePosts = [
  {
    title: 'Bắt đầu với Next.js 16',
    excerpt: 'Hướng dẫn chi tiết cách thiết lập và sử dụng Next.js 16 với TypeScript.',
    content: `Next.js 16 mang đến những cải tiến vượt bậc trong hiệu suất và trải nghiệm phát triển.

Trong bài viết này, chúng tôi sẽ khám phá:
- Cách cài đặt Next.js mới nhất
- App Router vs Pages Router
- Server Components và Client Components
- Routing nâng cao
- Optimizations tích hợp

Next.js 16 sử dụng Turbopack, một bundler mới được viết bằng Rust, giúp build nhanh hơn 10 lần so với webpack.`,
  },
  {
    title: 'Supabase: Backend as a Service cho dân web',
    excerpt: 'Khám phá cách sử dụng Supabase để xây dựng backend mà không cần backend engineer.',
    content: `Supabase là một nền tảng Backend as a Service (BaaS) mạnh mẽ dựa trên PostgreSQL.

Những tính năng chính:
- PostgreSQL database quản lý hoàn toàn
- Row Level Security (RLS) tích hợp
- Authentication với Email, GitHub, Google
- Realtime subscriptions
- Storage cho files
- Vector embeddings (AI)

Supabase giúp developer fullstack có thể tập trung vào frontend mà vẫn có backend đủ mạnh.`,
  },
  {
    title: 'TypeScript Tips & Tricks',
    excerpt: 'Những mẹo hay và trickỆ để viết TypeScript tốt hơn.',
    content: `TypeScript là ngôn ngữ lập trình tuyệt vời để xây dựng ứng dụng quy mô lớn.

Bạn sẽ học:
- Generics nâng cao
- Conditional Types
- Mapped Types
- Utility Types (Pick, Omit, Record, etc)
- Type Guards
- Discriminated Unions

Với những kỹ năng này, bạn có thể viết mã TypeScript type-safe và maintainable.`,
  },
  {
    title: 'Tailwind CSS: Styling hiện đại',
    excerpt: 'Làm sao tạo giao diện đẹp nhanh chóng với Tailwind CSS.',
    content: `Tailwind CSS là utility-first CSS framework giúp bạn tạo giao diện nhanh chóng.

Thay vì viết CSS, bạn sử dụng class names:
- Responsive design dễ dàng
- Dark mode support
- Custom components
- Performance optimization
- Extensible config

Tailwind kết hợp tốt với React và Next.js, giúp team develop nhanh hơn.`,
  },
  {
    title: 'Row Level Security trong PostgreSQL',
    excerpt: 'Bảo mật dữ liệu ở mức database với Row Level Security.',
    content: `Row Level Security (RLS) là tính năng bảo mật của PostgreSQL cho phép kiểm soát truy cập ở mức từng dòng.

Với RLS, bạn có thể:
- Định nghĩa policies cho từng user
- Kiểm soát truy cập dựa trên role
- Bảo mật dữ liệu ở tầng database
- Giảm logic bảo mật ở application

Supabase tích hợp RLS dễ dàng, giúp bạn bảo mật ứng dụng một cách hiệu quả.`,
  },
]

async function seedPosts() {
  try {
    // Lấy user đầu tiên
    const { data: { users } } = await supabase.auth.admin.listUsers()

    if (!users || users.length === 0) {
      console.error('❌ Không tìm thấy user nào. Vui lòng tạo user trước.')
      return
    }

    const userId = users[0].id
    console.log(`📝 Sử dụng user ID: ${userId}`)

    // Insert 5 bài viết
    const postsToInsert = samplePosts.map((post) => ({
      title: post.title,
      slug: generateSlug(post.title),
      excerpt: post.excerpt,
      content: post.content,
      author_id: userId,
      status: 'published',
      published_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('posts')
      .insert(postsToInsert)
      .select()

    if (error) {
      console.error('❌ Lỗi:', error.message)
      return
    }

    console.log(`✅ Đã tạo ${data?.length || 0} bài viết!`)
    console.log('Danh sách bài viết:')
    data?.forEach((post: any, idx: number) => {
      console.log(`  ${idx + 1}. ${post.title}`)
    })
  } catch (error: any) {
    console.error('❌ Lỗi:', error.message)
  }
}

seedPosts()
