import { createClient } from '@lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CommentForm } from '@/src/components/posts/comment-form'
import { CommentList } from '@/src/components/posts/comment-list'
import { LikeButton } from '@/src/components/posts/like-button'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  return {
    title: post?.title || 'Bài viết',
    description: post?.excerpt || '',
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !post) {
    notFound()
  }

  // Lấy số lượng likes
  const { count: likeCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post.id)

  // Lấy comments
  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('post_id', post.id)
    .order('created_at', { ascending: true })

  // Kiểm tra user đã đăng nhập chưa
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 text-gray-500">
            <span>Bởi {post.profiles?.display_name || 'Ẩn danh'}</span>
            <span>•</span>
            <time>
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none mb-12">
          {/* Display featured image */}
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-auto rounded-lg mb-8 object-cover"
            />
          )}

          {/* Render markdown content */}
          {post.content?.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {/* Like Section */}
      <div className="mb-8 flex gap-4">
        <LikeButton postId={post.id} userId={user?.id || null} initialLikeCount={likeCount || 0} />
      </div>

      {/* Comments Section */}
      <section className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">
          Bình luận ({comments?.length || 0})
        </h2>

        {user ? (
          <div className="mb-8">
            <CommentForm postId={post.id} />
          </div>
        ) : (
          <p className="text-gray-500 mb-8">
            <a href="/login" className="text-blue-600 hover:text-blue-500">
              Đăng nhập
            </a>
            {' '}để bình luận.
          </p>
        )}

        <CommentList comments={comments || []} />
      </section>
    </main>
  )
}
