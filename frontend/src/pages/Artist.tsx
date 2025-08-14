import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Music, Clock, DollarSign, Calendar, CheckCircle } from 'lucide-react'
import axios from 'axios'

interface Artist {
  address: string
  name: string
  bio: string
  total_tracks: number
  total_earnings: number
  verified: boolean
  registered_at: number
}

interface Track {
  id: string
  title: string
  genre: string
  duration_ms: number
  play_count: number
  created_at: number
}

const Artist = () => {
  const { address } = useParams<{ address: string }>()
  const [artist, setArtist] = useState<Artist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        // In a real app, you'd fetch from the API
        // const response = await axios.get(`http://localhost:3001/api/artists/${address}`)
        
        // Mock data for demonstration
        const mockArtist: Artist = {
          address: address || '',
          name: 'Digital Dreams',
          bio: 'Electronic music producer creating ambient soundscapes and experimental beats. Passionate about pushing the boundaries of sound and creating immersive musical experiences.',
          total_tracks: 15,
          total_earnings: 5000000000, // 5 APT in octas
          verified: true,
          registered_at: Date.now() - 7776000000 // 90 days ago
        }

        const mockTracks: Track[] = [
          {
            id: '1',
            title: 'Midnight Dreams',
            genre: 'Electronic',
            duration_ms: 180000,
            play_count: 1250,
            created_at: Date.now() - 86400000
          },
          {
            id: '2',
            title: 'Neon Lights',
            genre: 'Electronic',
            duration_ms: 210000,
            play_count: 890,
            created_at: Date.now() - 172800000
          },
          {
            id: '3',
            title: 'Digital Rain',
            genre: 'Ambient',
            duration_ms: 240000,
            play_count: 650,
            created_at: Date.now() - 259200000
          }
        ]

        setArtist(mockArtist)
        setTracks(mockTracks)
      } catch (error) {
        console.error('Failed to fetch artist data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (address) {
      fetchArtistData()
    }
  }, [address])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!artist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Artist Not Found</h2>
        <p className="text-gray-600">The artist you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Artist Header */}
      <div className="card">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <Music className="h-12 w-12 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
              {artist.verified && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-4">{artist.bio}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(artist.registered_at)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Music className="h-4 w-4" />
                <span>{artist.total_tracks} tracks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tracks</p>
              <p className="text-2xl font-bold text-gray-900">{artist.total_tracks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plays</p>
              <p className="text-2xl font-bold text-gray-900">
                {tracks.reduce((sum, track) => sum + track.play_count, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                {(artist.total_earnings / 100000000).toFixed(2)} APT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
          <span className="text-sm text-gray-500">{tracks.length} tracks</span>
        </div>

        {tracks.length > 0 ? (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <button className="p-2 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors">
                    <Play className="h-4 w-4 text-primary-600" />
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-900">{track.title}</h3>
                    <p className="text-sm text-gray-600">{track.genre}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(track.duration_ms)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{track.play_count} plays</span>
                  </div>
                  <span>{formatDate(track.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks yet</h3>
            <p className="text-gray-600">This artist hasn't uploaded any tracks yet.</p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Uploaded "Midnight Dreams"</span>
            <span className="text-gray-400">2 days ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Earned 0.05 APT from plays</span>
            <span className="text-gray-400">1 week ago</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Uploaded "Neon Lights"</span>
            <span className="text-gray-400">2 weeks ago</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Artist