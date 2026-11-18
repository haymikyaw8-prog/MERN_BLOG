
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, BookOpen } from 'lucide-react'
import API from '../lib/api'
import useAuthStore from '../stores/authStore'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`)
        setPost(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load story.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this story?'
    )

    if (!confirmDelete) return

    try {
      await API.delete(`/posts/${id}`)
      alert('Story deleted successfully.')
      navigate('/my-stories')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete story.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <p className="text-sm font-medium text-[#68766d]">
          Loading story...
        </p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-5 text-center">
        <BookOpen size={42} className="mb-4 text-[#8fa995]" />

        <h2 className="mb-2 text-2xl font-bold text-[#20352f]">
          Story not found
        </h2>

        <p className="mb-6 text-sm text-[#778279]">
          {error || 'This story may have been removed.'}
        </p>

        <Link
          to="/"
          className="rounded-full bg-[#20352f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#314d40]"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  // Get story author ID
  const authorId = post.creator || post.creatorId || post.userId

  // Get logged-in user ID from Zustand or JWT token
  let tokenUserId = null

  try {
    const token = sessionStorage.getItem('token')

    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )

      tokenUserId = payload.id || payload._id || payload.userId
      console.log('Current User:', currentUser)
      console.log('Token User ID:', tokenUserId)
      console.log('Logged-in User ID:', loggedInUserId)
      console.log('Story Creator ID:', authorId)
      console.log('Is Owner:', isOwner)
    }
  } catch (err) {
    console.error('Failed to read user token:', err)
  }

  const loggedInUserId = currentUser?.id || tokenUserId

  // Check whether the logged-in user owns this story
  const isOwner =
    Boolean(loggedInUserId && authorId) &&
    String(authorId._id || authorId) === String(loggedInUserId)

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-6 md:py-16">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#e5e6dc] bg-white shadow-sm">

        <div className="px-6 py-8 md:px-12 md:py-12">

          <Link
            to="/"
            className="mb-9 inline-flex items-center gap-2 text-sm font-semibold text-[#68766d] transition hover:text-[#20352f]"
          >
            <ArrowLeft size={17} />
            Back to stories
          </Link>

          <div className="mb-6">
            <span className="inline-flex rounded-full bg-[#eaf0e8] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#48634e]">
              {post.category || 'Uncategorized'}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-[#20352f] md:text-5xl">
            {post.title}
          </h1>

          <div className="mb-8 flex items-center gap-3 border-b border-[#e9ede6] pb-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6eee5] text-lg font-bold text-[#48634e]">
              {(post.creator?.name || post.author?.name || 'A')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="text-xs text-[#89948b]">
                Written by
              </p>

              <p className="text-sm font-semibold text-[#34483a]">
                {post.creator?.name || post.author?.name || 'Unknown Author'}
              </p>
            </div>
          </div>

          {post.thumbnail && (
            <div className="mb-10 overflow-hidden rounded-2xl bg-[#f0f2ec]">
              <img
                src={`http://localhost:5000/uploads/${post.thumbnail}`}
                alt={post.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          )}

          <div className="whitespace-pre-line text-base leading-8 text-[#424b44] md:text-lg md:leading-9">
            {post.description}
          </div>

          {isOwner && (
            <div className="mt-12 flex flex-wrap gap-3 border-t border-[#e9ede6] pt-8">

              <Link
                to={`/edit-post/${id}`}
                className="inline-flex items-center gap-2 rounded-full bg-[#20352f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#314d40]"
              >
                <Pencil size={16} />
                Edit Story
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Delete Story
              </button>

            </div>
          )}
        </div>
      </article>

      <div className="mx-auto mt-8 max-w-4xl text-center">
        <Link
          to="/"
          className="text-sm font-semibold text-[#68766d] transition hover:text-[#20352f]"
        >
          Explore more stories →
        </Link>
      </div>
    </main>
  )
}

export default PostDetail
