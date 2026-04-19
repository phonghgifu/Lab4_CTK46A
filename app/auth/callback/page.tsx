'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      // Lấy session sau khi OAuth callback
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Đăng nhập thành công, chuyển hướng tới dashboard
        router.push('/dashboard')
      } else {
        // Lỗi, chuyển hướng về login
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Đang xử lý...</h1>
        <p className="text-gray-600">Vui lòng chờ trong khi chúng tôi hoàn thành đăng nhập của bạn</p>
      </div>
    </div>
  )
}
