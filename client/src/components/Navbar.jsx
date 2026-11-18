
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  PenLine,
  UserRound,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

import useAuthStore from '../stores/authStore'

function Navbar() {
  const { isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const navStyle = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
      isActive
        ? 'bg-[#e5ece4] text-[#20352f]'
        : 'text-[#68766d] hover:bg-[#f0f3ed] hover:text-[#20352f]'
    }`

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/login')
  }

  const mobileLinkStyle = ({ isActive }) =>
    `block rounded-xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? 'bg-[#e5ece4] text-[#20352f]'
        : 'text-[#68766d] hover:bg-[#f5f7f2]'
    }`

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e5e6dc] bg-[#fffefa]/95 shadow-sm backdrop-blur-md">

      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-5 md:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5ece4] text-[#20352f]">
            <BookOpen size={25} strokeWidth={2.2} />
          </div>

          <div>
            <span className="block text-xl font-bold tracking-tight text-[#20352f] sm:text-2xl">
              Commonplace<span className="text-[#8fa995]">.</span>
            </span>

            <span className="hidden text-[10px] font-semibold tracking-[0.13em] text-[#89948b] sm:block">
              A PLACE FOR YOUR STORIES
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">

          <NavLink to="/" end className={navStyle}>
            Home
          </NavLink>

          <NavLink to="/authors" className={navStyle}>
            Authors
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/my-stories" className={navStyle}>
                My Stories
              </NavLink>

              <NavLink
                to="/write"
                className="ml-2 inline-flex items-center gap-2 rounded-full bg-[#20352f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#314c42]"
              >
                <PenLine size={16} />
                Write Story
              </NavLink>

              <NavLink
                to="/profile"
                aria-label="My Profile"
                className={({ isActive }) =>
                  `ml-1 flex h-10 w-10 items-center justify-center rounded-full transition ${
                    isActive
                      ? 'bg-[#e5ece4] text-[#20352f]'
                      : 'text-[#68766d] hover:bg-[#f0f3ed] hover:text-[#20352f]'
                  }`
                }
              >
                <UserRound size={21} />
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[#68766d] transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navStyle}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="ml-2 rounded-full bg-[#20352f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#314c42]"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#20352f] transition hover:bg-[#e5ece4] md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#e5e6dc] bg-[#fffefa] px-5 py-5 shadow-lg md:hidden">

          <div className="flex flex-col gap-2">

            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={mobileLinkStyle}
            >
              Home
            </NavLink>

            <NavLink
              to="/authors"
              onClick={closeMenu}
              className={mobileLinkStyle}
            >
              Authors
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/my-stories"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  My Stories
                </NavLink>

                <NavLink
                  to="/write"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-xl bg-[#20352f] px-4 py-3 text-sm font-semibold text-white"
                >
                  <PenLine size={17} />
                  Write Story
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  My Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-[#20352f] px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}

          </div>
        </div>
      )}

    </nav>
  )
}

export default Navbar