import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ClassicBook from './templates/classic/Book'
import ModernBook from './templates/modern/Book'

export default function AppRoutes({ cfg }) {
  const key = (cfg.templateKey || 'classic').toLowerCase()
  return (
    <Routes>
      <Route path="/" element={<Home cfg={cfg} />} />
      <Route
        path="/book"
        element={key === 'modern' ? <ModernBook cfg={cfg} /> : <ClassicBook cfg={cfg} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
