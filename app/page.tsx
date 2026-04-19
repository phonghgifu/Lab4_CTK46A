import Link from 'next/link'
import { createClient } from '@lib/supabase/server'

const POSTS_PER_PAGE = 3

interface HomePageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient()
  
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page || '1'))
  const offset = (currentPage - 1) * POSTS_PER_PAGE

  // Lấy tổng số bài viết
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Lấy bài viết của trang hiện tại
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + POSTS_PER_PAGE - 1)

  if (error) {
    console.error('Error fetching posts:', error)
  }

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Bài viết mới nhất</h1>

      {posts && posts.length > 0 ? (
        <>
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white p-6 rounded-lg shadow border border-gray-200"
              >
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                )}

                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-semibold hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="text-gray-600 mt-2">{post.excerpt}</p>
                )}

                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>
                    Bởi {post.profiles?.display_name || 'Ẩn danh'}
                  </span>
                  <span>•</span>
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN')
                      : 'Chưa xuất bản'}
                  </span>
                </div>

                <Link
                  href={`/posts/${post.slug}`}
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500"
                >
                  Đọc tiếp →
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t">
            <div className="text-sm text-gray-600">
              Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>
            </div>

            <div className="flex gap-4">
              {hasPrevPage ? (
                <Link
                  href={`/?page=${currentPage - 1}`}
                  className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
                >
                  ← Trang trước
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
                >
                  ← Trang trước
                </button>
              )}

              {hasNextPage ? (
                <Link
                  href={`/?page=${currentPage + 1}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Trang sau →
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-100 text-gray-400 rounded-md cursor-not-allowed"
                >
                  Trang sau →
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có bài viết nào.</p>
        </div>
      )}
    </main>
  )
}
