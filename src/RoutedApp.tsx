import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './pages/Layout'
import LargeCityByCountry from './pages/LargeCityByCountry'
import NoPage from './pages/NoPage'

import Shell from './pages/Shell'
import TwentyLargestCities from './pages/TwentyLargestCities'

export default function RoutedApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Shell />} />
          <Route path="large-by-country" element={<LargeCityByCountry />} />
          <Route path="20-largest" element={<TwentyLargestCities />} />
          <Route path="shell" element={<Shell />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
