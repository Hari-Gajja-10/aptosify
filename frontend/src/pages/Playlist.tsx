import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Music, Clock, User, Calendar, Heart, Plus } from 'lucide-react'

interface Playlist {
  id: string
  name: string
  owner: string
  tracks: string[]
  is_public: boolean
  created_at: number
  play_count: number
}

interface Track {
  id: string
  title: string
  artist_address: string
  genre: string
  duration_ms: number
  play_count: number
}

const Playlist = () => {
  const { id } = useParams<{ id: string }>()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylistData = async () => {
      try {
        // Mock data for demonstration
        const mockPlaylist: Playlist = {
          id: id || '',
          name: 'Chill Vibes',
          owner: '0x123...abc',
          tracks: ['1', '2', '3'],
          is_public: true,
          created_at: Date.now() - 259200000, // 3 days ago
          play_count: 450
        }

        const mockTracks: Track[] = [
          {
            id: '1',
            title: 'Midnight Dreams',
            artist_address: '0x123...abc',
            genre: 'Electronic',
            duration_ms: 180000,
            play_count: 1250
          },
          {
            id: '2',
            title: 'Ocean Waves',
            artist_address: '0x456...def',
            genre: 'Ambient',
            duration_ms: 240000,
            play_count: 890
          },
          {
            id: '3',
            title: 'Digital Rain',
            artist_address: '0x789...ghi',
            genre: 'Electronic',
            duration_ms: 210000,
            play_count: 650
          }
        ]

        setPlaylist(mockPlaylist)
        setTracks(mockTracks)
      } catch (error) {
        console.error('Failed to fetch playlist data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPlaylistData()
    }
  }, [id])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const totalDuration = tracks.reduce((sum, track) => sum + track.duration_ms, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Playlist Not Found</h2>
        <p className="text-gray-600">The playlist you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Playlist Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Music className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{playlist.name}</h1>
                {playlist.is_public ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Public
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    Private
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4">
                A curated collection of {tracks.length} tracks for your listening pleasure
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Created by {playlist.owner}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(playlist.created_at)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Play className="h-4 w-4" />
                  <span>{playlist.play_count} plays</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-primary flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Play All</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tracks</p>
              <p className="text-2xl font-bold text-gray-900">{tracks.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(totalDuration)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Play className="h-6 w-6 text-purple-600" />
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
              <User className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Artists</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(tracks.map(track => track.artist_address)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tracks</h2>
          <button className="btn-secondary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Track</span>
          </button>
        </div>

        {tracks.length > 0 ? (
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <button className="p-2 bg-primary-100 rounded-full hover:bg-primary-200 transition-colors">
                    <Play className="h-4 w-4 text-primary-600" />
                  </button>
                  <div>
                    <h3 className="font-medium text-gray-900">{track.title}</h3>
                    <p className="text-sm text-gray-600">{track.artist_address}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span className="text-gray-400">{track.genre}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(track.duration_ms)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>{track.play_count}</span>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks yet</h3>
            <p className="text-gray-600">This playlist is empty. Add some tracks to get started.</p>
          </div>
        )}
      </div>

      {/* Playlist Actions */}
      <div className="flex items-center justify-center space-x-4">
        <button className="btn-primary flex items-center space-x-2">
          <Play className="h-4 w-4" />
          <span>Play All</span>
        </button>
        <button className="btn-secondary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add to Library</span>
        </button>
        <button className="btn-secondary flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span>Like Playlist</span>
        </button>
      </div>
    </div>
  )
}

export default Playlist