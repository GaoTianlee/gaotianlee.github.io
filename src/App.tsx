import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import Education from '@/pages/Education'
import Work from '@/pages/Work'
import Awards from '@/pages/Awards'
import Social from '@/pages/Social'
import Shop from '@/pages/Shop'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="education" element={<Education />} />
        <Route path="work" element={<Work />} />
        <Route path="awards" element={<Awards />} />
        <Route path="social" element={<Social />} />
        <Route path="shop" element={<Shop />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}
