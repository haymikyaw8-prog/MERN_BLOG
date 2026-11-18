
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Pencil,
  ImagePlus,
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import API from '../lib/api'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Generate preview for selected image
  const preview = useMemo(() => {
    if (!thumbnail) return null
    return URL.createObjectURL(thumbnail)
  }, [thumbnail])

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  // Fetch existing post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`)
        const post = response.data

        setTitle(post.title || '')
        setCategory(post.category || 'Uncategorized')
        setDescription(post.description || '')
        setCurrentThumbnail(post.thumbnail || '')
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load story.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  // Select new image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      e.target.value = ''
      return
    }

    setError('')
    setThumbnail(file)
  }

  // Update post
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('description', description)

    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    try {
      setSaving(true)

      await API.patch(`/posts/${id}`, formData)

      alert('Story updated successfully!')
      navigate('/my-stories')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update story.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <p className="text-sm font-medium text-[#68766d]">
          Loading your story...
        </p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-3xl">

        <button
          type="button"
          onClick={() => navigate('/my-stories')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#52665a] transition hover:text-[#20352f]"
        >
          <ArrowLeft size={18} />
          Back to My Stories
        </button>

        <div className="overflow-hidden rounded-3xl border border-[#e5e6dc] bg-white shadow-sm">

          {/* Header */}
          <div className="bg-[#20352f] px-6 py-8 text-white md:px-10 md:py-10">
            <div className="mb-5 inline-flex rounded-xl bg-white/10 p-3 text-[#c6d8c8]">
              <Pencil size={25} />
            </div>

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b8cbb9]">
              Your writing space
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Edit Story
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#d2ddd4]">
              Make changes to your story and share your updated version.
            </p>
          </div>

          <div className="p-6 md:p-10">

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                  Story Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your story title"
                  className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] px-4 py-3.5 text-[#252a27] outline-none transition focus:border-[#8fa995] focus:bg-white focus:ring-2 focus:ring-[#8fa995]/20"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#303b34]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe4dc] bg-[#fafbf8] px-4 py-3.5 text-[#252a27] outline-none transition focus:border-[#8fa995] focus:bg-white focus:ring-2 focus:ring-[#8fa995]/20"
                >
                  {[
                    'Agriculture',
                    'Business',
                    'Education',
                    'Entertainment',
                    'Art',
                    'Investment',
                    'Uncategorized',
                    'Weather',
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#303b34]">
                    Story Description
                  </label>

                  <span className="text-xs text-[#8a968c]">
                    {description.length} characters
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your story here..."
                  className="min-h-72 w-full resize-y rounded-xl border border-[#dfe4dc] bg-[#fafbf8] px-4 py-4 leading-7 text-[#252a27] outline-none transition focus:border-[#8fa995] focus:bg-white focus:ring-2 focus:ring-[#8fa995]/20"
                  required
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-[#303b34]">
                  Story Thumbnail
                </label>

                <div className="overflow-hidden rounded-2xl border border-[#e5e9e1] bg-[#fafbf8] p-4">

                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#52665a]">
                    <ImageIcon size={18} />
                    {thumbnail ? 'New Image Preview' : 'Current Story Image'}
                  </div>

                  {preview || currentThumbnail ? (
                    <img
                      src={
                        preview ||
                        `http://localhost:5000/uploads/${currentThumbnail}`
                      }
                      alt="Story thumbnail preview"
                      className="h-64 w-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-52 flex-col items-center justify-center rounded-xl bg-[#edf1e9] text-[#829184]">
                      <ImageIcon size={36} />
                      <p className="mt-2 text-sm">
                        No thumbnail available
                      </p>
                    </div>
                  )}

                  {thumbnail && (
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="truncate text-xs text-[#68766d]">
                        {thumbnail.name}
                      </p>

                      <button
                        type="button"
                        onClick={() => setThumbnail(null)}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#cbd8cc] bg-[#f7f9f5] px-5 py-7 text-center transition hover:border-[#8fa995] hover:bg-[#f0f5ef]">
                  <div className="mb-3 rounded-full bg-[#e6eee5] p-3 text-[#526f59]">
                    <ImagePlus size={25} />
                  </div>

                  <span className="text-sm font-semibold text-[#34483a]">
                    Choose a new thumbnail
                  </span>

                  <span className="mt-2 text-xs text-[#8a968c]">
                    Select an image from your computer
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-[#8a968c]">
                  Leave unchanged to keep your current image.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-[#edf0e9] pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate('/my-stories')}
                  className="rounded-full border border-[#dfe4dc] px-7 py-3.5 text-sm font-semibold text-[#526057] transition hover:bg-[#f5f7f2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20352f] px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#314d40] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />
                  {saving ? 'Updating...' : 'Update Story'}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default EditPost