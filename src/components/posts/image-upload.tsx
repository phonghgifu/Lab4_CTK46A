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

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      const { data, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(`posts/${fileName}`, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(`posts/${fileName}`)

      const imageUrl = publicData.publicUrl
      onImageUploaded(imageUrl)
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi upload ảnh')
      setPreview(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Upload ảnh bài viết
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading || disabled}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
          disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {preview && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Xem trước:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs h-auto rounded-md border border-gray-200"
          />
        </div>
      )}

      {loading && (
        <p className="text-sm text-blue-600">Đang upload...</p>
      )}
    </div>
  )
}
