import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Test connection by getting session
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Chào mừng đến với Simple Blog
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chia sẻ những suy nghĩ của bạn với thế giới
          </p>
          <p className="text-lg text-gray-500 mb-4">
            ✅ Supabase connection: {session ? 'Logged in' : 'Not logged in'} (OK)
          </p>
          <p className="text-sm text-gray-400">
            Nếu bạn thấy dòng này, Supabase đã được cấu hình thành công!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Tính Năng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">✍️</div>
              <h3 className="text-xl font-bold mb-2">Viết Bài</h3>
              <p className="text-gray-600">
                Tạo và xuất bản những bài viết của bạn với dễ dàng
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Bảo Mật</h3>
              <p className="text-gray-600">
                Dữ liệu của bạn được bảo vệ bằng Row Level Security
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Bình Luận</h3>
              <p className="text-gray-600">
                Cho phép độc giả bình luận trên các bài viết của bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay để viết bài viết đầu tiên của bạn
          </p>
        </div>
      </section>
    </main>
  )
}
