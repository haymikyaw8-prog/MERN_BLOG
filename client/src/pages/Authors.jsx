
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  ArrowUpRight,
  UserRound,
} from 'lucide-react'
import API from '../lib/api'

function Authors() {
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await API.get('/users')

        const data = response.data

        if (Array.isArray(data)) {
          setAuthors(data)
        } else if (Array.isArray(data.users)) {
          setAuthors(data.users)
        } else if (Array.isArray(data.authors)) {
          setAuthors(data.authors)
        } else {
          setAuthors([])
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load authors.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f3ed]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#dce5da] border-t-[#20352f]" />
          <p className="text-sm text-[#68766d]">
            Discovering authors...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f3ed] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-10 rounded-3xl bg-[#20352f] px-6 py-10 text-white md:px-10 md:py-14">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#c6d8c8]">
            <Users size={15} />
            Our Community
          </div>

          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Meet Our Authors
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#d2ddd4] md:text-base">
            Discover creative minds, explore their stories, and connect
            with people who love sharing ideas.
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

      
        {!error && (
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#20352f]">
                Our Writers
              </h2>
              <p className="mt-1 text-sm text-[#849087]">
                Get to know the people behind the stories.
              </p>
            </div>

            <span className="rounded-full bg-[#e5ece4] px-4 py-2 text-xs font-bold text-[#45634c]">
              {authors.length} Authors
            </span>
          </div>
        )}

       
        {!error && authors.length === 0 && (
          <div className="rounded-3xl border border-[#e4e7de] bg-white px-6 py-16 text-center shadow-sm">
            <Users size={42} className="mx-auto mb-4 text-[#8fa995]" />

            <h2 className="text-xl font-bold text-[#20352f]">
              No authors found
            </h2>

            <p className="mt-2 text-sm text-[#849087]">
              There are no authors to display right now.
            </p>
          </div>
        )}

      
        {!error && authors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <article
                key={author._id}
                className="group rounded-2xl border border-[#e4e7de] bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
               
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#e8efe6] bg-[#edf2eb] text-[#526f59]">
                  {author.avatar ? (
                    <img
                      src={`http://localhost:5000/uploads/${author.avatar}`}
                      alt={author.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={42} strokeWidth={1.5} />
                  )}
                </div>

            
                <h3 className="text-xl font-bold text-[#20352f]">
                  {author.name || 'Anonymous Author'}
                </h3>

                <p className="mt-2 truncate text-sm text-[#849087]">
                  {author.email || 'Blog Community Member'}
                </p>

               
                <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-[#edf2eb] px-4 py-2 text-sm font-semibold text-[#45634c]">
                  <BookOpen size={16} />
                  {Math.max(0, author.posts || 0)} Stories
                </div>

                
                <Link
                  to={`/authors/${author._id}`}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#20352f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314d40]"
                >
                  View Profile
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Authors