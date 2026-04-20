'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [displayName, setDisplayName] = useState(profile.display_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-red-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-green-500 mt-0.5">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">✅ Cập nhật thông tin thành công!</p>
          </div>
        </div>
      )}

      {/* Display Name Field */}
      <div>
        <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên hiển thị
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
          placeholder="Nhập tên hiển thị của bạn..."
        />
        <p className="text-xs text-gray-500 mt-1">Tên này sẽ hiển thị trên các bài viết của bạn</p>
      </div>

      {/* Avatar URL Field */}
      <div>
        <label htmlFor="avatarUrl" className="block text-sm font-semibold text-gray-700 mb-2">
          URL ảnh đại diện
        </label>
        <input
          id="avatarUrl"
          type="url"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400"
          placeholder="https://example.com/avatar.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">Dán URL của ảnh đại diện (JPG, PNG, GIF...)</p>

        {/* Avatar Preview */}
        {avatarUrl && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Xem trước ảnh đại diện</p>
            <div className="flex items-center gap-4">
              <img
                src={avatarUrl}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{displayName || 'Tên của bạn'}</p>
                <p className="text-xs text-gray-500">Xem trước tài khoản của bạn</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v.01M17.66 6.344l-.707.707M20.485 9.515h-.01M20.485 14.485h-.01m-2.819 2.819l-.707.707M12 20v.01M6.344 17.66l-.707-.707M3.515 14.485h.01M3.515 9.515h.01M6.344 6.344l-.707-.707" />
            </svg>
            Đang cập nhật...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Lưu thay đổi
          </span>
        )}
      </button>
    </form>
  )
}
