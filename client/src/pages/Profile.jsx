
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound,
  Camera,
  Save,
  LockKeyhole,
  Mail,
  User,
  ArrowLeft,
} from 'lucide-react'
import API from '../lib/api'
import useAuthStore from '../stores/authStore'

function Profile() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)

  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  let userId = currentUser?.id

  try {
    const token = sessionStorage.getItem('token')

    if (!userId && token) {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )

      userId = payload.id
    }
  } catch (err) {
    console.error('Token error:', err)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError('Please login to view your profile.')
        setLoading(false)
        return
      }

      try {
        const response = await API.get(`/users/${userId}`)
        const profile = response.data

        setUser(profile)
        setName(profile.name || '')
        setEmail(profile.email || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleAvatarChange = async (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (selectedFile.size > 500000) {
      setError('Profile picture must be smaller than 500KB.')
      return
    }

    const formData = new FormData()
    formData.append('avatar', selectedFile)

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      const response = await API.post('/users/change-avatar', formData)

      setUser(response.data)
      setSuccess('Profile picture updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      setSaving(true)

      const response = await API.patch('/users/edit-user', {
        name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      })

      setUser((previous) => ({
        ...previous,
        ...response.data,
      }))

      setName(response.data.name)
      setEmail(response.data.email)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <p className="text-sm font-medium text-[#68766d]">
          Loading your profile...
        </p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-5 text-center">
        <UserRound size={45} className="mb-4 text-[#8fa995]" />

        <h2 className="mb-3 text-2xl font-bold text-[#20352f]">
          Profile unavailable
        </h2>

        <p className="mb-6 text-sm text-red-500">{error}</p>

        <button
          onClick={() => navigate('/login')}
          className="rounded-full bg-[#20352f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#314d40]"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-4xl">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#68766d] hover:text-[#20352f]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="overflow-hidden rounded-3xl border border-[#e5e6dc] bg-white shadow-sm">

          <div className="bg-[#20352f] px-6 py-9 text-white md:px-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b8cbb9]">
              Your account
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 text-sm text-[#d2ddd4]">
              Manage your personal information and account settings.
            </p>
          </div>

          <div className="p-6 md:p-10">

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-[#cbdcca] bg-[#edf5ec] p-4 text-sm text-[#426448]">
                {success}
              </div>
            )}

            <section className="mb-10 flex flex-col items-center gap-5 border-b border-[#e9ede6] pb-9 sm:flex-row">

              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#e6eee5] bg-[#e6eee5] text-[#526f59]">
                  {user.avatar ? (
                    <img
                      src={`http://localhost:5000/uploads/${user.avatar}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={48} />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#20352f] text-white transition hover:bg-[#314d40]">
                  <Camera size={18} />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold text-[#20352f]">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-[#7c897f]">
                  {user.email}
                </p>

                <p className="mt-3 text-xs text-[#89948b]">
                  {uploading
                    ? 'Uploading picture...'
                    : 'Click the camera icon to change your photo.'}
                </p>

                <p className="mt-1 text-xs text-[#89948b]">
                  Maximum image size: 500KB
                </p>
              </div>
            </section>

            <form onSubmit={handleSubmit} className="space-y-7">

              <div>
                <h2 className="mb-5 text-xl font-bold text-[#20352f]">
                  Personal Information
                </h2>

                <div className="space-y-5">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                      Full Name
                    </label>

                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a968c]"
                      />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] py-3.5 pl-11 pr-4 text-[#252a27] outline-none focus:border-[#8fa995] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a968c]"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] py-3.5 pl-11 pr-4 text-[#252a27] outline-none focus:border-[#8fa995] focus:bg-white"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="border-t border-[#e9ede6] pt-7">
                <h2 className="text-xl font-bold text-[#20352f]">
                  Change Password
                </h2>

                <p className="mb-5 mt-2 text-sm text-[#89948b]">
                  Enter your current password and choose a new password.
                </p>

                <div className="space-y-5">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                      Current Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8a968c]"
                      />

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                        className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] py-3.5 pl-11 pr-4 text-[#252a27] outline-none focus:border-[#8fa995] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] px-4 py-3.5 text-[#252a27] outline-none focus:border-[#8fa995] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                      Confirm New Password
                    </label>

                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] px-4 py-3.5 text-[#252a27] outline-none focus:border-[#8fa995] focus:bg-white"
                    />
                  </div>

                </div>
              </div>

              <div className="border-t border-[#e9ede6] pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#20352f] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#314d40] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Save size={17} />
                  {saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Profile
