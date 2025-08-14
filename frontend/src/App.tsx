import { Routes, Route } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Upload from './pages/Upload'
import Artist from './pages/Artist'
import Playlist from './pages/Playlist'
import Profile from './pages/Profile'

function App() {
  return (
    <WalletProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/artist/:address" element={<Artist />} />
          <Route path="/playlist/:id" element={<Playlist />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </WalletProvider>
  )
}

export default App