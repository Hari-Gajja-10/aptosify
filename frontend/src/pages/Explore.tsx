import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Play, Music, User, Clock, Heart } from 'lucide-react'
import axios from 'axios'

interface Track {
  id: string
  title: string
  artist_address: string
  genre: string
  duration_ms: number
  play_count: number
  created_at: number
}

interface Artist {
  address: string
  name: string
  bio: string
  total_tracks: number
  total_earnings: number
  verified: boolean
}

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists'>('tracks')
  const [tracks, setTracks] = useState<Track[]>([])
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockTracks: Track[] = [
      {
        id: '1',
        title: 'Midnight Dreams',
        artist_address: '0x123...abc',
        genre: 'Electronic',
        duration_ms: 180000,
        play_count: 1250,
        created_at: Date.now() - 86400000
      },
      {
        id: '2',
        title: 'Ocean Waves',
        artist_address: '0x456...def',
        genre: 'Ambient',
        duration_ms: 240000,
        play_count: 890,
        created_at: Date.now() - 172800000
      },
      {
        id: '3',
        title: 'Urban Rhythm',
        artist_address: '0x789...ghi',
        genre: 'Hip Hop',
        duration_ms: 210000,
        play_count: 2100,
        created_at: Date.now() - 259200000
      }
    ]

    const mockArtists: Artist[] = [
      {
        address: '0x123...abc',
        name: 'Digital Dreams',
        bio: 'Electronic music producer creating ambient soundscapes',
        total_tracks: 15,
        total_earnings: 5000000000, // 5 APT in octas
        verified: true
      },
      {
        address: '0x456...def',
        name: 'Wave Master',
        bio: 'Ambient and chill music artist',
        total_tracks: 8,
        total_earnings: 3000000000, // 3 APT in octas
        verified: false
      },
      {
        address: '0x789...ghi',
        name: 'Beat Maker',
        bio: 'Hip hop producer and beat maker',
        total_tracks: 22,
        total_earnings: 8000000000, // 8 APT in octas
        verified: true
      }
    ]

    setTracks(mockTracks)
    setArtists(mockArtists)
    setLoading(false)
  }, [])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const filteredTracks = tracks.filter(track =>
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.bio.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Music</h1>
          <p className="text-gray-600">Discover amazing tracks and artists</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search tracks, artists, or genres..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('tracks')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tracks'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tracks ({filteredTracks.length})
        </button>
        <button
          onClick={() => setActiveTab('artists')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'artists'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Artists ({filteredArtists.length})
        </button>
      </div>

      {/* Tracks Tab */}
      {activeTab === 'tracks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track) => (
            <div key={track.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{track.title}</h3>
                  <p className="text-sm text-gray-600">{track.genre}</p>
                </div>
                <button className="p-2 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors">
                  <Play className="h-4 w-4 text-primary-600" />
                </button>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(track.duration_ms)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Music className="h-4 w-4" />
                    <span>{track.play_count} plays</span>
                  </div>
                </div>
                <span>{formatDate(track.created_at)}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/artist/${track.artist_address}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Artist
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artists Tab */}
      {activeTab === 'artists' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.address} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{artist.name}</h3>
                    {artist.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{artist.bio}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tracks</p>
                  <p className="font-semibold text-gray-900">{artist.total_tracks}</p>
                </div>
                <div>
                  <p className="text-gray-500">Earnings</p>
                  <p className="font-semibold text-gray-900">
                    {(artist.total_earnings / 100000000).toFixed(2)} APT
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/artist/${artist.address}`}
                  className="btn-primary w-full text-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'tracks' && filteredTracks.length === 0) ||
        (activeTab === 'artists' && filteredArtists.length === 0)) && (
        <div className="text-center py-12">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab} found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search terms or browse all {activeTab}.
          </p>
        </div>
      )}
    </div>
  )
}

export default Explore