
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserRound, BookOpen, CalendarDays, ArrowLeft } from 'lucide-react'
import API from '../lib/api'

function AuthorProfile() {
  const { id } = useParams()

  const [author, setAuthor] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const [authorResponse, postsResponse] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/posts/users/${id}`),
        ])

        setAuthor(authorResponse.data)

        const postData = postsResponse.data
        setPosts(Array.isArray(postData) ? postData : postData.posts || [])
      } catch (err) {
        console.error('Author profile error:', err)
        setError(
          err.response?.data?.message || 'Unable to load author profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAuthorProfile()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <p className="text-sm font-medium text-[#68766d]">
          Loading author profile...
        </p>
      </div>
    )
  }

  if (error || !author) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f3ed] px-5 text-center">
        <UserRound size={45} className="mb-4 text-[#8fa995]" />
        <h2 className="text-2xl font-bold text-[#20352f]">
          Author not found
        </h2>
        <p className="mt-3 text-sm text-red-500">
          {error || 'This author does not exist.'}
        </p>
        <Link
          to="/"
          className="mt-6 rounded-full bg-[#20352f] px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">

        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#68766d] hover:text-[#20352f]"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Author Header */}
        <section className="overflow-hidden rounded-3xl border border-[#e5e6dc] bg-white shadow-sm">

          <div className="h-36 bg-[#20352f] md:h-48">
            <div className="flex h-full items-center justify-center opacity-20">
              <BookOpen size={100} className="text-white" />
            </div>
          </div>

          <div className="px-6 pb-8 md:px-10">
            <div className="-mt-14 mb-5 flex flex-col items-center gap-5 sm:flex-row sm:items-end">

              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#e6eee5] text-[#526f59] shadow-sm">
                {author.avatar ? (
                  <img
                    src={`http://localhost:5000/uploads/${author.avatar}`}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={48} />
                )}
              </div>

              <div className="pb-2 text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8fa995]">
                  Storyteller
                </p>

                <h1 className="mt-1 text-3xl font-bold text-[#20352f]">
                  {author.name}
                </h1>

                <p className="mt-1 text-sm text-[#89948b]">
                  {author.email}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 border-t border-[#e9ede6] pt-6">

              <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f2] px-5 py-4">
                <BookOpen className="text-[#526f59]" size={21} />
                <div>
                  <p className="text-xl font-bold text-[#20352f]">
                    {posts.length}
                  </p>
                  <p className="text-xs text-[#89948b]">
                    Published Stories
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f2] px-5 py-4">
                <CalendarDays className="text-[#526f59]" size={21} />
                <div>
                  <p className="text-sm font-bold text-[#20352f]">
                    Author
                  </p>
                  <p className="text-xs text-[#89948b]">
                    Blog Contributor
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Author Stories */}
        <section className="mt-12">

          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8fa995]">
              Explore the collection
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#20352f] md:text-3xl">
              Stories by {author.name}
            </h2>

            <p className="mt-2 text-sm text-[#89948b]">
              Discover all the stories published by this author.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd5c9] bg-white px-6 py-16 text-center">
              <BookOpen
                size={40}
                className="mx-auto mb-4 text-[#8fa995]"
              />

              <h3 className="text-lg font-bold text-[#20352f]">
                No stories yet
              </h3>

              <p className="mt-2 text-sm text-[#89948b]">
                This author hasn't published any stories.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {posts.map((post) => (
                <Link
                  to={`/posts/${post._id}`}
                  key={post._id}
                  className="group overflow-hidden rounded-2xl border border-[#e5e6dc] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-52 overflow-hidden bg-[#e6eee5]">
                    {post.thumbnail ? (
                      <img
                        src={`http://localhost:5000/uploads/${post.thumbnail}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#8fa995]">
                        <BookOpen size={48} />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="inline-block rounded-full bg-[#edf3eb] px-3 py-1 text-xs font-semibold text-[#526f59]">
                      {post.category || 'Story'}
                    </span>

                    <h3 className="mt-4 line-clamp-2 text-lg font-bold text-[#20352f] transition group-hover:text-[#718d75]">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#89948b]">
                      {post.description}
                    </p>

                    <div className="mt-5 border-t border-[#e9ede6] pt-4">
                      <span className="text-sm font-semibold text-[#526f59]">
                        Read Story →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

            </div>
          )}
        </section>

      </div>
    </main>
  )
}

export default AuthorProfile
