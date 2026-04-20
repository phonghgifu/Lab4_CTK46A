'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LikeButtonProps {
  postId: string
  userId: string | null
  initialLikeCount: number
}

export function LikeButton({ postId, userId, initialLikeCount }: LikeButtonProps) {
  const router = useRouter()
  const supabase = createClient()

  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  // Kiểm tra user đã like bài viết này chưa
  useEffect(() => {
    if (!userId) return

    const checkLike = async () => {
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()

      setIsLiked(!!data)
    }

    checkLike()
  }, [postId, userId, supabase])

  const handleLike = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId)

        if (error) throw error

        setIsLiked(false)
        setLikeCount(Math.max(0, likeCount - 1))
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId,
          })

        if (error) throw error

        setIsLiked(true)
        setLikeCount(likeCount + 1)
      }

      router.refresh()
    } catch (err) {
      console.error('Lỗi khi like:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading || !userId}
      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${
        isLiked
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={!userId ? 'Đăng nhập để like' : ''}
    >
      <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  )
}
