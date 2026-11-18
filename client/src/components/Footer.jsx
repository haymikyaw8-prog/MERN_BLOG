
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Mail,
  ArrowUpRight,
} from 'lucide-react'

function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e5e3dc] bg-[#20352F] text-[#F5F3ED]">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

         
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8FA995]">
                <BookOpen size={23} className="text-[#20352F]" />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Story<span className="text-[#A9C2AD]">Space.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#D0D9D1]">
              A place where ideas become stories. Share your thoughts,
              discover new perspectives, and connect through writing.
            </p>
          </div>

          <div>
            <h3 className="mb-5 font-semibold text-white">Explore</h3>
            <div className="flex flex-col gap-3 text-sm text-[#D0D9D1]">
              <Link to="/" className="transition hover:text-[#A9C2AD]">
                Home
              </Link>
              <Link to="/authors" className="transition hover:text-[#A9C2AD]">
                Authors
              </Link>
              <Link to="/my-stories" className="transition hover:text-[#A9C2AD]">
                My Stories
              </Link>
              <Link to="/write" className="transition hover:text-[#A9C2AD]">
                Write a Story
              </Link>
            </div>
          </div>

     
          <div>
            <h3 className="mb-5 font-semibold text-white">Account</h3>
            <div className="flex flex-col gap-3 text-sm text-[#D0D9D1]">
              <Link to="/login" className="transition hover:text-[#A9C2AD]">
                Login
              </Link>
              <Link to="/register" className="transition hover:text-[#A9C2AD]">
                Create Account
              </Link>
              <Link to="/profile" className="transition hover:text-[#A9C2AD]">
                My Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#D0D9D1]">
            © {new Date().getFullYear()} StorySpace. All rights reserved.
          </p>

          <a
            href="mailto:hello@storyspace.com"
            className="inline-flex items-center gap-2 text-xs text-[#D0D9D1] transition hover:text-[#A9C2AD]"
          >
            <Mail size={15} />
            Contact Us
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer