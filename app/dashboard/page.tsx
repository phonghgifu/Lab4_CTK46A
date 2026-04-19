'use client'

import { useAuth } from '@/lib/auth/context'
import { logout } from '@/lib/auth/helpers'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const result = await logout()

    if (result.success) {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Đang đăng xuất...' : 'Đăng Xuất'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Chào mừng!</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-gray-600">User ID:</p>
              <p className="text-lg font-medium font-mono text-sm">{user?.id}</p>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-xl font-bold mb-4">Chức năng:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>📝 Viết bài viết mới</li>
                <li>✏️ Chỉnh sửa bài viết của bạn</li>
                <li>🗑️ Xóa bài viết</li>
                <li>👤 Chỉnh sửa hồ sơ</li>
                <li>💬 Xem bình luận</li>
              </ul>
            </div>

            <div className="pt-6">
              <p className="text-gray-600 text-sm">
                ✅ Bạn đã đăng nhập thành công! Các tính năng tiếp theo sẽ được thêm vào.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
