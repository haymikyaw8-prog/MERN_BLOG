
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PenLine,
  BookOpen,
  Pencil,
  ArrowUpRight,
  FileText,
  Feather,
  Trash2,
} from 'lucide-react'
import API from '../lib/api'

function MyStories() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const token = sessionStorage.getItem('token')

        if (!token) {
          setError('Please login again to view your stories.')
          return
        }

        const payload = JSON.parse(
          atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )

        const userId = payload.id

        if (!userId) {
          setError('User ID not found. Please login again.')
          return
        }

        const response = await API.get(`/posts/users/${userId}`)
        setPosts(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load your stories.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMyStories()
  }, [])

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this story?'
    )

    if (!confirmDelete) return

    try {
      setDeletingId(postId)

      await API.delete(`/posts/${postId}`)

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== postId)
      )

      alert('Story deleted successfully.')
    } catch (err) {
      alert(
        err.response?.data?.message || 'Failed to delete story.'
      )
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#dce5da] border-t-[#20352f]" />
          <p className="text-sm font-medium text-[#68766d]">
            Loading your stories...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">

        <section className="mb-10 overflow-hidden rounded-3xl bg-[#20352f] px-6 py-9 text-white md:px-10 md:py-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#c6d8c8]">
                <Feather size={14} />
                Your collection
              </div>

              <h1 className="text-3xl font-bold text-white md:text-5xl">
                My Stories
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#d2ddd4] md:text-base">
                Every story has a voice. Manage your writing, revisit your
                ideas, and keep sharing what matters.
              </p>
            </div>

            <Link
              to="/write"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#e5ece4] px-6 py-3.5 text-sm font-bold text-[#20352f] transition hover:bg-white"
            >
              <PenLine size={18} />
              Write New Story
            </Link>
          </div>
        </section>

        <section className="mb-9 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e4e7de] bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-[#e8efe6] p-3 text-[#45634c]">
              <BookOpen size={25} />
            </div>

            <div>
              <p className="text-sm text-[#7b867c]">Published Stories</p>
              <p className="text-2xl font-bold text-[#20352f]">
                {posts.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-[#e4e7de] bg-white p-5 shadow-sm">
            <div className="rounded-xl bg-[#f0eee3] p-3 text-[#8a8057]">
              <FileText size={25} />
            </div>

            <div>
              <p className="text-sm text-[#7b867c]">Your Collection</p>
              <p className="text-lg font-bold text-[#20352f]">
                Personal Library
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && posts.length === 0 && (
          <section className="rounded-3xl border border-[#e4e7de] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8efe6] text-[#526f59]">
              <BookOpen size={38} />
            </div>

            <h2 className="text-2xl font-bold text-[#20352f]">
              Your library is waiting
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#7b867c]">
              You haven't published any stories yet. Start writing and
              make your first idea part of your collection.
            </p>

            <Link
              to="/write"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#20352f] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#314d40]"
            >
              <PenLine size={17} />
              Write Your First Story
            </Link>
          </section>
        )}

        {!error && posts.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#20352f]">
                  Your Published Work
                </h2>
                <p className="mt-1 text-sm text-[#849087]">
                  All your stories in one place.
                </p>
              </div>

              <span className="rounded-full bg-[#e5ece4] px-4 py-2 text-xs font-bold text-[#45634c]">
                {posts.length} {posts.length === 1 ? 'Story' : 'Stories'}
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className="group overflow-hidden rounded-2xl border border-[#e4e7de] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-56 overflow-hidden bg-[#e8eee6]">
                    {post.thumbnail ? (
                      <img
                        src={`http://localhost:5000/uploads/${post.thumbnail}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#829184]">
                        <BookOpen size={45} strokeWidth={1.3} />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#45634c] shadow-sm">
                      {post.category || 'Uncategorized'}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-14 text-xl font-bold leading-7 text-[#20352f] transition group-hover:text-[#526f59]">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#7b867c]">
                      {post.description || 'No description available.'}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#edf0e9] pt-5">
                      <Link
                        to={`/posts/${post._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#edf2eb] px-2 py-3 text-xs font-bold text-[#34523c] transition hover:bg-[#dce8dc]"
                      >
                        Read Story
                        <ArrowUpRight size={15} />
                      </Link>

                      <Link
                        to={`/edit-post/${post._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#20352f] px-2 py-3 text-xs font-bold text-white transition hover:bg-[#314d40]"
                      >
                        <Pencil size={14} />
                        Edit Story
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-3 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={15} />
                        {deletingId === post._id
                          ? 'Deleting...'
                          : 'Delete Story'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MyStories