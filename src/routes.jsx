import * as React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

export default function AppRoutes({ cfg }) {
  return (
    <Routes>
      <Route path="/" element={<Home cfg={cfg} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
