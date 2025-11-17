import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ChildNew from './pages/ChildNew'
import SessionNew from './pages/SessionNew'
import SessionSuccess from './pages/SessionSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

function App() {
  return (
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
