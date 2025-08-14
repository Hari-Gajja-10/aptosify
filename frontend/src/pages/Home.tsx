import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play, Music, Users, TrendingUp, DollarSign } from 'lucide-react'
import { useWallet } from '../contexts/WalletContext'
import axios from 'axios'

interface PlatformStats {
  totalTracks: number
  totalArtists: number
  totalPlays: number
  platformEarnings: number
}

const Home = () => {
  const { connected } = useWallet()
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      title: 'Total Tracks',
      value: stats?.totalTracks || 0,
      icon: Music,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Artists',
      value: stats?.totalArtists || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Plays',
      value: stats?.totalPlays || 0,
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Platform Earnings',
      value: `${(stats?.platformEarnings || 0) / 100000000} APT`,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Welcome to{' '}
          <span className="text-primary-600">Aptos Music</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The decentralized music platform where artists can upload tracks, create remixes, 
          and earn royalties through smart contracts on the Aptos blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!connected ? (
            <Link
              to="/explore"
              className="btn-primary text-lg px-8 py-3"
            >
              Explore Music
            </Link>
          ) : (
            <Link
              to="/upload"
              className="btn-primary text-lg px-8 py-3"
            >
              Upload Track
            </Link>
          )}
          <Link
            to="/explore"
            className="btn-secondary text-lg px-8 py-3"
          >
            Browse Artists
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stat.value}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Music className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Upload & Monetize
          </h3>
          <p className="text-gray-600">
            Upload your music tracks and earn royalties every time someone plays them.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Create Remixes
          </h3>
          <p className="text-gray-600">
            Create remixes of existing tracks with automatic royalty distribution.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Build Community
          </h3>
          <p className="text-gray-600">
            Connect with other artists and fans through playlists and collaborations.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Musical Journey?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of artists already earning on the blockchain
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/upload"
            className="bg-white text-primary-600 font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Upload Your First Track
          </Link>
          <Link
            to="/explore"
            className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
          >
            Explore Music
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home