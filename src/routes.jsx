import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassicBook from './templates/classic/Book'
import ModernBook from './templates/modern/Book'
import NotFound from './pages/NotFound'

export default function AppRoutes({ cfg }) {
  const key = (cfg?.templateKey || '').toLowerCase()
  const BookComponent = key === 'modern' ? ModernBook : ClassicBook

  return (
    <Routes>
      <Route path="/" element={<Home cfg={cfg} />} />
      <Route path="/book" element={<BookComponent cfg={cfg} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
