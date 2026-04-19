import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Vui lòng đăng nhập</p>
      </div>
    )
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">👋 Xin chào, {profile?.display_name || user.email}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-lg font-semibold text-gray-900">{user.email}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Tổng bài viết</p>
            <p className="text-lg font-semibold text-gray-900">{posts?.length || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Bài đã publish</p>
            <p className="text-lg font-semibold text-gray-900">
              {posts?.filter(p => p.status === 'published').length || 0}
            </p>
          </div>
        </div>

        <Link
          href="/posts/create"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition-colors"
        >
          ✍️ Viết bài mới
        </Link>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">📚 Bài viết của bạn</h2>
        </div>
        
        {posts && posts.length > 0 ? (
          <div className="divide-y">
            {posts.map((post) => (
              <div key={post.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={`/posts/${post.slug}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {post.excerpt || post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span>
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? '📢 Đã publish' : '📝 Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/posts/edit/${post.id}`}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Sửa
                    </Link>
                    <button
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600 mb-4">Bạn chưa viết bài nào</p>
            <Link
              href="/posts/create"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Viết bài đầu tiên
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
