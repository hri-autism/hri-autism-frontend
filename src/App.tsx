import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ChildNew from './pages/ChildNew'
import SessionNew from './pages/SessionNew'
import SessionSuccess from './pages/SessionSuccess'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/child/new" element={<ChildNew />} />
      <Route path="/session/new" element={<SessionNew />} />
      <Route path="/session/success/:sessionId" element={<SessionSuccess />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
