import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import FlagsPage from './pages/Flags'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items/:id" element={<ItemDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="flags" element={<FlagsPage />} />
      </Route>
    </Routes>
  )
}

export default App
