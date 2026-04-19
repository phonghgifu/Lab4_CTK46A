import Link from 'next/link'
import { createClient } from '@lib/supabase/server'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export const metadata = {
  title: 'Tìm kiếm bài viết',
  description: 'Tìm kiếm bài viết trên blog',
}

function highlightText(text: string, query: string) {
  if (!text) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark style="background-color: #fbbf24; padding: 0 4px;">$1</mark>')
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const query = params.q || ''

  let results = []
  let error = null

  if (query.trim().length > 0) {
    const { data, error: searchError } = await supabase
      .rpc('search_posts', { search_query: query })

    if (searchError) {
      error = searchError.message
    } else {
      results = data || []
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tìm kiếm bài viết</h1>

      {/* Search Form */}
      <form method="GET" className="mb-8 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Nhập từ khóa tìm kiếm..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Results */}
      {query.trim().length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Hãy nhập từ khóa để tìm kiếm bài viết
        </p>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Lỗi: {error}
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Không tìm thấy bài viết nào phù hợp với "{query}"
        </p>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            Tìm thấy <strong>{results.length}</strong> kết quả cho "{query}"
          </p>

          <div className="space-y-6">
            {results.map((post: any) => (
              <article
                key={post.id}
                className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-lg transition-shadow"
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
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
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
                  className="inline-block mt-4 text-blue-600 hover:text-blue-500 font-medium"
                >
                  Đọc tiếp →
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
