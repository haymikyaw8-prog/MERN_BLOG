import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, ImagePlus } from 'lucide-react'
import API from '../lib/api'

function Write() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!thumbnail) {
      setError('Please select a thumbnail image.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('thumbnail', thumbnail)

    try {
      setLoading(true)
      await API.post('/posts', formData)
      alert('Story published successfully!')
      navigate('/my-stories')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish story.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#faf8f6] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-2xl border border-rose-100 bg-white p-6 shadow-sm md:p-10">
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-xl bg-rose-50 p-3 text-rose-500">
            <PenLine size={25} />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-rose-500">
            Share your ideas
          </p>
          <h1 className="text-3xl font-bold text-stone-800">
            Write a Story
          </h1>
          <p className="mt-2 text-stone-500">
            Turn your thoughts into a story worth sharing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Story Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 transition focus:border-rose-300 focus:bg-white focus:outline-none"
              placeholder="Enter your story title"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 focus:border-rose-300 focus:outline-none"
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
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Story Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-64 w-full resize-y rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-stone-800 focus:border-rose-300 focus:bg-white focus:outline-none"
              placeholder="Write your story here..."
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Thumbnail Image
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50 px-5 py-8 text-center transition hover:bg-rose-50">
              <ImagePlus className="mb-2 text-rose-400" size={30} />
              <span className="font-semibold text-stone-700">
                {thumbnail ? thumbnail.name : 'Choose an image'}
              </span>
              <span className="mt-1 text-sm text-stone-500">
                Select a thumbnail for your story
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0] || null)}
                className="hidden"
                required
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose-500 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish Story'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default Write