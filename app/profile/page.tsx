import { createClient } from '@lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/src/components/profile/profile-form'

export const metadata = {
  title: 'Hồ sơ cá nhân',
  description: 'Xem và chỉnh sửa hồ sơ cá nhân',
}

export default async function ProfilePage() {
  const supabase = await createClient()

  // Kiểm tra user đã đăng nhập chưa
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Lấy profile của user
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          Không tìm thấy hồ sơ của bạn
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Thông tin user */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">ID</label>
            <p className="text-sm text-gray-600 break-all font-mono">{user.id}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Thành viên từ</label>
            <p className="text-lg font-medium text-gray-900">
              {new Date(user.created_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Form chỉnh sửa */}
        <div>
          <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </main>
  )
}
