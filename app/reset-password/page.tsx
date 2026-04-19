'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu không trùng khớp')
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        setErrorMsg(error.message)
        return
      }

      setMessage('Mật khẩu đã được thay đổi thành công! Vui lòng đăng nhập lại.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setErrorMsg('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Nếu có lỗi từ Supabase (link hết hạn)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600">Lỗi</h2>
            <p className="mt-4 text-gray-700">
              {errorDescription?.replace(/\+/g, ' ') || 'Có lỗi xảy ra'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              ({errorCode})
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Liên kết reset mật khẩu có thể đã hết hạn. Vui lòng yêu cầu liên kết mới.
            </p>
            
            <Link
              href="/forgot-password"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Quay lại & Yêu cầu liên kết mới
            </Link>

            <Link
              href="/auth/login"
              className="block w-full text-center py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Form đặt mật khẩu mới
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Đặt mật khẩu mới</h2>
          <p className="mt-2 text-gray-600">
            Nhập mật khẩu mới của bạn
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          {message && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm border border-green-200">
              ✓ {message}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-200">
              ✕ {errorMsg}
            </div>
          )}

          {message ? (
            <Link
              href="/auth/login"
              className="block w-full text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          ) : (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới
                </label>
                <input
                  id="password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang lưu...' : 'Đặt mật khẩu mới'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  )
}
