'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ onImageUploaded, disabled = false }: ImageUploadProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setLoading(true)

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Vui lòng chọn file hình ảnh')
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Kích thước file không được vượt quá 5MB')
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Check authentication
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Bạn cần đăng nhập để upload ảnh')
      }

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(`posts/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Lỗi upload: ${uploadError.message}`)
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`posts/${fileName}`)

      const imageUrl = publicData.publicUrl
      onImageUploaded(imageUrl)
    } catch (err: any) {
      console.error('Image upload error:', err)
      setError(err.message || 'Có lỗi xảy ra khi upload ảnh. Vui lòng kiểm tra đăng nhập hoặc thử lại.')
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📷 Ảnh bài viết
        </label>
        
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading || disabled}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              disabled:opacity-50 disabled:cursor-not-allowed
              border border-gray-300 rounded-lg p-3 cursor-pointer
              hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB)</p>
      </div>

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

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <div className="text-blue-500 mt-0.5 animate-spin">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v.01M17.66 6.344l-.707.707M20.485 9.515h-.01M20.485 14.485h-.01m-2.819 2.819l-.707.707M12 20v.01M6.344 17.66l-.707-.707M3.515 14.485h.01M3.515 9.515h.01M6.344 6.344l-.707-.707" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Đang upload ảnh...</p>
          </div>
        </div>
      )}

      {preview && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Xem trước</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg border border-gray-300 shadow-sm"
          />
        </div>
      )}
    </div>
  )
}
