import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ChildNew from './pages/ChildNew'
import SessionNew from './pages/SessionNew'
import SessionSuccess from './pages/SessionSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.search])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/child/new"
          element={
            <ProtectedRoute>
              <ChildNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/new"
          element={
            <ProtectedRoute>
              <SessionNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session/success/:sessionId"
          element={
            <ProtectedRoute>
              <SessionSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
