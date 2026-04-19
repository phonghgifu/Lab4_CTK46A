'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth/context'
import { logout } from '@/lib/auth/helpers'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logout()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">📝</span>
            <span className="text-xl font-bold text-gray-900">Simple Blog</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Trang Chủ
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Dashboard
                </Link>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{user?.email}</span>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
                  >
                    {isLoading ? '...' : 'Đăng Xuất'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Đăng Nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
