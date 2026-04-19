'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Nếu đang load, chờ
    if (isLoading) return

    // Nếu chưa đăng nhập, redirect tới login
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đang tải...</h1>
        </div>
      </div>
    )
  }

  // Nếu chưa đăng nhập, không render (sẽ redirect)
  if (!isAuthenticated) {
    return null
  }

  return children
}
