import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  
  // Get published posts only (for anonymous/public view)
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, excerpt, content, slug, author_id, status, created_at, profiles(display_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          📖 Simple Blog
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Chia sẻ những suy nghĩ và kiến thức của bạn với thế giới
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Bắt đầu viết
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">📚 Bài viết mới nhất</h2>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.slug}`}>
                <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                    {post.excerpt || post.content}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      👤 {post.profiles?.display_name || 'Anonymous'}
                    </span>
                    <span className="text-sm text-gray-500">
                      📅 {new Date(post.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Chưa có bài viết nào được công bố</p>
            <p className="text-gray-500">Hãy là người đầu tiên chia sẻ bài viết của bạn!</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Sẵn sàng chia sẻ?</h3>
        <p className="text-blue-100 mb-6">
          Tạo tài khoản ngay để bắt đầu viết blog của riêng bạn
        </p>
        <Link
          href="/register"
          className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
        >
          Đăng ký miễn phí
        </Link>
      </div>
    </div>
  )
}
