import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ClassicBook from './templates/book/classic/Book'
import ModernBook from './templates/book/modern/Book'
import NotFound from './pages/NotFound'
import { useHotel } from './HotelContext'

export default function AppRoutes({ cfg }) {
  const key = (cfg?.templateKey || '').toLowerCase()
  const BookComponent = key === 'modern' ? ModernBook : ClassicBook
  const { hotel } = useHotel()

  return (
    <Routes>
      <Route path="/" element={<Home cfg={cfg} />} />
      <Route path="/book" element={<BookComponent cfg={cfg} hotel={hotel} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
