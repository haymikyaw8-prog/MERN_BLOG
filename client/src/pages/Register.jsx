
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../lib/api'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await API.post('/users/register', formData)
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm"
      >
        <h1 className="mb-2 text-center text-3xl font-bold">Create Account</h1>
        <p className="mb-8 text-center text-stone-500">
          Join our blogging community
        </p>

        {error && (
          <p className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-2 block">Name</label>
          <input
            className="w-full rounded-lg border p-3"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block">Email</label>
          <input
            className="w-full rounded-lg border p-3"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block">Password</label>
          <input
            className="w-full rounded-lg border p-3"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block">Confirm Password</label>
          <input
            className="w-full rounded-lg border p-3"
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>

        <button
          className="w-full rounded-lg bg-stone-900 p-3 font-semibold text-white hover:bg-stone-700 disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-stone-900 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register