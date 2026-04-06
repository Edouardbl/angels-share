import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Brewery from './pages/Brewery'
import Distributor from './pages/Distributor'
import Bar from './pages/Bar'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/brewery" element={<Brewery />} />
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/bar" element={<Bar />} />
      </Routes>
    </BrowserRouter>
  )
}
