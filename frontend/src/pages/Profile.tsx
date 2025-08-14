import { useState, useEffect } from 'react'
import { useWallet } from '../contexts/WalletContext'
import { useForm } from 'react-hook-form'
import { User, Music, Play, DollarSign, Settings, Edit, Plus, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

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

interface Playlist {
  id: string
  name: string
  tracks: string[]
  is_public: boolean
  created_at: number
  play_count: number
}

const Profile = () => {
  const { connected, address, signAndSubmitTransaction } = useWallet()
  const [activeTab, setActiveTab] = useState<'overview' | 'tracks' | 'playlists' | 'earnings'>('overview')
  const [artist, setArtist] = useState<Artist | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const editForm = useForm<{ name: string; bio: string }>()

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Mock data for demonstration
        const mockArtist: Artist = {
          address: address || '',
          name: 'Digital Dreams',
          bio: 'Electronic music producer creating ambient soundscapes and experimental beats.',
          total_tracks: 8,
          total_earnings: 2500000000, // 2.5 APT in octas
          verified: false,
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
          }
        ]

        const mockPlaylists: Playlist[] = [
          {
            id: '1',
            name: 'Chill Vibes',
            tracks: ['1', '2'],
            is_public: true,
            created_at: Date.now() - 259200000,
            play_count: 450
          },
          {
            id: '2',
            name: 'Workout Mix',
            tracks: ['1'],
            is_public: false,
            created_at: Date.now() - 518400000,
            play_count: 120
          }
        ]

        setArtist(mockArtist)
        setTracks(mockTracks)
        setPlaylists(mockPlaylists)
        editForm.reset({ name: mockArtist.name, bio: mockArtist.bio })
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (connected && address) {
      fetchProfileData()
    }
  }, [connected, address, editForm])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
  }

  const onEditSubmit = async (data: { name: string; bio: string }) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      // In a real app, you'd update the artist profile on the blockchain
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (!connected) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Connect Your Wallet</h2>
        <p className="text-gray-600">
          Please connect your wallet to view your profile and manage your content.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-primary-600" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Artist Name
                    </label>
                    <input
                      type="text"
                      {...editForm.register('name', { required: 'Name is required' })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      {...editForm.register('bio', { required: 'Bio is required' })}
                      className="input-field"
                      rows={3}
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{artist?.name}</h1>
                    {artist?.verified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{artist?.bio}</p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    <span>Joined {formatDate(artist?.registered_at || 0)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Upload Track</span>
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Music className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tracks</p>
              <p className="text-2xl font-bold text-gray-900">{artist?.total_tracks || 0}</p>
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
            <div className="p-3 bg-purple-100 rounded-lg">
              <Heart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Playlists</p>
              <p className="text-2xl font-bold text-gray-900">{playlists.length}</p>
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
                {((artist?.total_earnings || 0) / 100000000).toFixed(2)} APT
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'tracks', label: 'Tracks', icon: Music },
          { key: 'playlists', label: 'Playlists', icon: Heart },
          { key: 'earnings', label: 'Earnings', icon: DollarSign }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Uploaded "Midnight Dreams"</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Earned 0.05 APT from plays</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Created playlist "Chill Vibes"</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Tracks</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Upload New Track</span>
              </button>
            </div>
            {tracks.length > 0 ? (
              <div className="space-y-4">
                {tracks.map((track) => (
                  <div key={track.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
                      <span>{formatDuration(track.duration_ms)}</span>
                      <span>{track.play_count} plays</span>
                      <span>{formatDate(track.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks yet</h3>
                <p className="text-gray-600">Upload your first track to get started.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'playlists' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Your Playlists</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Playlist</span>
              </button>
            </div>
            {playlists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{playlist.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        playlist.is_public 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {playlist.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {playlist.tracks.length} tracks • {playlist.play_count} plays
                    </p>
                    <div className="flex items-center space-x-2">
                      <button className="btn-primary text-sm">
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </button>
                      <button className="btn-secondary text-sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
                <p className="text-gray-600">Create your first playlist to organize your music.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Earnings Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                <h3 className="text-lg font-medium mb-2">Total Earnings</h3>
                <p className="text-3xl font-bold">
                  {((artist?.total_earnings || 0) / 100000000).toFixed(2)} APT
                </p>
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
                <h3 className="text-lg font-medium mb-2">This Month</h3>
                <p className="text-3xl font-bold">0.25 APT</p>
              </div>
              <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                <h3 className="text-lg font-medium mb-2">This Week</h3>
                <p className="text-3xl font-bold">0.05 APT</p>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Play of "Midnight Dreams"</span>
                  <span className="font-medium text-green-600">+0.01 APT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Play of "Neon Lights"</span>
                  <span className="font-medium text-green-600">+0.01 APT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform fee</span>
                  <span className="font-medium text-red-600">-0.005 APT</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile