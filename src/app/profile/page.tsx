import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/profile/profile-form'

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
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
            <p className="font-semibold">⚠️ Lỗi</p>
            <p>Không tìm thấy hồ sơ của bạn</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin tài khoản */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin tài khoản</h2>
              
              <div className="space-y-6">
                {/* Avatar Preview */}
                {profile.avatar_url && (
                  <div className="text-center pb-6 border-b border-gray-200">
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-100 shadow-md"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</p>
                  <p className="text-sm text-gray-900 font-medium break-all">{user.email}</p>
                </div>

                {/* User ID */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">ID</p>
                  <p className="text-xs text-gray-600 font-mono break-all bg-gray-50 p-2 rounded border border-gray-200">{user.id}</p>
                </div>

                {/* Member Since */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Thành viên từ</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {new Date(user.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form chỉnh sửa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Chỉnh sửa thông tin</h2>
              <ProfileForm profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
