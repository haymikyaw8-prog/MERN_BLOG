
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Authors from './pages/Authors'
import MyStories from './pages/MyStories'
import PostDetail from './pages/PostDetail'
import AuthorProfile from './pages/AuthorProfile'
import Write from './pages/Write'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#faf8f6]">
        <Navbar />

        <Routes>
         
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:id" element={<AuthorProfile />} />
          <Route path="/posts/:id" element={<PostDetail />} />

       
          <Route
            path="/my-stories"
            element={
              <ProtectedRoute>
                <MyStories />
              </ProtectedRoute>
            }
          />

          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <Write />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-post/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

       
          <Route
            path="*"
            element={
              <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
                <h1 className="text-4xl font-bold text-stone-800">
                  404
                </h1>
                <p className="mt-3 text-stone-500">
                  Sorry, this page could not be found.
                </p>
              </div>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
