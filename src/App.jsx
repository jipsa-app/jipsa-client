import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MonthlyGuide from './pages/MonthlyGuide'
import JeonseGuide from './pages/JeonseGuide'
import SaleGuide from './pages/SaleGuide'
import Documents from './pages/Documents'
import Checklist from './pages/Checklist'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Schedule from './pages/Schedule'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monthly" element={<MonthlyGuide />} />
        <Route path="/jeonse" element={<JeonseGuide />} />
        <Route path="/sale" element={<SaleGuide />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
