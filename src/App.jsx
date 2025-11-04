import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import Privacy from './pages/Privacy'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proyecto/:id" element={<ProjectDetail />} />
        <Route path="/privacidad" element={<Privacy />} />
      </Routes>
    </Router>
  )
}

export default App 