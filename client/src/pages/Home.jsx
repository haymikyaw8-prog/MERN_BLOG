
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Search, Feather } from 'lucide-react'
import API from '../lib/api'

function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts')
        setPosts(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load stories.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = [
    'All',
    'Agriculture',
    'Business',
    'Education',
    'Entertainment',
    'Art',
    'Investment',
    'Weather',
  ]

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      category === 'All' || post.category === category

    const matchesSearch =
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.description?.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <main className="min-h-screen bg-[#f5f3ed]">

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e5ece4] px-4 py-2 text-xs font-bold tracking-wider text-[#526f59]">
              <BookOpen size={16} />
              A PLACE FOR YOUR STORIES
            </span>

            <h1 className="max-w-2xl text-5xl font-bold leading-[1.12] tracking-tight text-[#20352f] md:text-6xl lg:text-7xl">
              Ideas worth sharing.
              <span className="mt-2 block text-[#8fa995]">
                Stories worth reading.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#777e78] md:text-lg">
              Discover thoughtful stories, explore new ideas, and share
              your own experiences with our community.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#latest-stories"
                className="inline-flex items-center gap-3 rounded-full bg-[#20352f] px-7 py-3.5 font-semibold text-white transition hover:bg-[#314c42]"
              >
                Explore Stories
                <ArrowRight size={18} />
              </a>

              <Link
                to="/register"
                className="inline-flex items-center rounded-full border border-[#cbd5c9] bg-white px-7 py-3.5 font-semibold text-[#20352f] transition hover:bg-[#edf3eb]"
              >
                Join Our Community
              </Link>
            </div>
          </div>

          {/* Hero Feature Card */}
          <div className="relative">
            <div className="rounded-[2rem] bg-[#e5ece4] p-4 md:p-7">
              <div className="rounded-[1.5rem] bg-white p-7 shadow-sm md:p-11">

                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e5ece4] text-[#526f59]">
                    <Feather size={25} />
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-[#8fa995]">
                      COMMONPLACE
                    </p>
                    <p className="text-sm font-semibold text-[#20352f]">
                      A community of storytellers
                    </p>
                  </div>
                </div>

                <h2 className="text-3xl font-bold leading-tight text-[#20352f] md:text-4xl">
                  Every story begins with an idea.
                </h2>

                <p className="mt-5 text-base leading-8 text-[#777e78]">
                  Read something inspiring today. Your next favorite
                  story might be just one click away.
                </p>

                <div className="mt-9 flex items-center gap-2">
                  <div className="h-2 w-12 rounded-full bg-[#526f59]" />
                  <div className="h-2 w-6 rounded-full bg-[#dce8dc]" />
                  <div className="h-2 w-6 rounded-full bg-[#dce8dc]" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-4 -z-0 h-24 w-24 rounded-full bg-[#cbdcca] blur-2xl" />
          </div>

        </div>
      </section>

      {/* Latest Stories */}
      <section
        id="latest-stories"
        className="mx-auto max-w-7xl px-5 pb-20 md:px-8"
      >

        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#8fa995]">
              DISCOVER
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#20352f] md:text-4xl">
              Latest Stories
            </h2>

            <p className="mt-3 text-[#777e78]">
              Fresh ideas and stories from our community.
            </p>
          </div>

          {/* Search */}
          <div className="flex w-full items-center gap-3 rounded-full border border-[#e3e6dc] bg-white px-5 py-3 md:w-80">
            <Search size={19} className="shrink-0 text-[#8fa995]" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-9 flex gap-3 overflow-x-auto pb-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                category === item
                  ? 'bg-[#20352f] text-white'
                  : 'border border-[#e3e6dc] bg-white text-[#68766d] hover:border-[#8fa995] hover:text-[#20352f]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-[#777e78]">
            Loading stories...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#cbd5c9] bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-[#8fa995]" size={45} />

            <h3 className="mt-5 text-xl font-bold text-[#20352f]">
              No stories found
            </h3>

            <p className="mt-2 text-sm text-[#89948b]">
              Try another search or category.
            </p>
          </div>
        )}

        {/* Story Cards */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-2xl border border-[#e5e6dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  to={`/posts/${post._id}`}
                  className="block overflow-hidden bg-[#e5ece4]"
                >
                  {post.thumbnail ? (
                    <img
                      src={`http://localhost:5000/uploads/${post.thumbnail}`}
                      alt={post.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-[#8fa995]">
                      <BookOpen size={48} />
                    </div>
                  )}
                </Link>

                <div className="p-6">
                  <span className="inline-block rounded-full bg-[#edf3eb] px-3 py-1 text-xs font-semibold text-[#526f59]">
                    {post.category || 'Uncategorized'}
                  </span>

                  <h3 className="mt-4 line-clamp-2 text-xl font-bold text-[#20352f] transition group-hover:text-[#718d75]">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#777e78]">
                    {post.description}
                  </p>

                  <Link
                    to={`/posts/${post._id}`}
                    className="mt-6 inline-flex items-center gap-2 border-t border-[#e9ede6] pt-4 text-sm font-bold text-[#526f59] hover:text-[#20352f]"
                  >
                    Read Story
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}

          </div>
        )}
      </section>
    </main>
  )
}

export default Home