import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useWallet } from '../contexts/WalletContext'
import { Upload as UploadIcon, Music, User, FileAudio } from 'lucide-react'
import toast from 'react-hot-toast'

interface UploadFormData {
  title: string
  genre: string
  duration: string
  ipfsHash: string
  royaltyRate: string
}

interface ArtistFormData {
  name: string
  bio: string
}

const Upload = () => {
  const { connected, address, signAndSubmitTransaction } = useWallet()
  const [isArtist, setIsArtist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'artist' | 'upload'>('artist')

  const artistForm = useForm<ArtistFormData>()
  const uploadForm = useForm<UploadFormData>()

  const onArtistSubmit = async (data: ArtistFormData) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      const payload = {
        function: `${import.meta.env.VITE_MODULE_ADDRESS}::players::register_artist`,
        type_arguments: [],
        arguments: [data.name, data.bio]
      }

      const hash = await signAndSubmitTransaction(payload)
      toast.success('Artist registered successfully!')
      setIsArtist(true)
      setStep('upload')
    } catch (error) {
      console.error('Failed to register artist:', error)
      toast.error('Failed to register artist')
    } finally {
      setLoading(false)
    }
  }

  const onUploadSubmit = async (data: UploadFormData) => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    try {
      const durationMs = parseInt(data.duration) * 1000 // Convert to milliseconds
      const royaltyRate = parseInt(data.royaltyRate) * 100 // Convert percentage to basis points

      const payload = {
        function: `${import.meta.env.VITE_MODULE_ADDRESS}::players::upload_track`,
        type_arguments: [],
        arguments: [data.title, data.genre, durationMs.toString(), data.ipfsHash, royaltyRate.toString()]
      }

      const hash = await signAndSubmitTransaction(payload)
      toast.success('Track uploaded successfully!')
      uploadForm.reset()
    } catch (error) {
      console.error('Failed to upload track:', error)
      toast.error('Failed to upload track')
    } finally {
      setLoading(false)
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
          Please connect your wallet to upload tracks and register as an artist.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Music</h1>
        <p className="text-gray-600">
          Share your music with the world and earn royalties on every play
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 ${step === 'artist' ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'artist' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="font-medium">Register as Artist</span>
        </div>
        <div className="w-8 h-1 bg-gray-200 rounded"></div>
        <div className={`flex items-center space-x-2 ${step === 'upload' ? 'text-primary-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="font-medium">Upload Track</span>
        </div>
      </div>

      {/* Artist Registration Form */}
      {step === 'artist' && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Register as Artist</h2>
          </div>
          
          <form onSubmit={artistForm.handleSubmit(onArtistSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artist Name
              </label>
              <input
                type="text"
                {...artistForm.register('name', { required: 'Artist name is required' })}
                className="input-field"
                placeholder="Enter your artist name"
              />
              {artistForm.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">{artistForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                {...artistForm.register('bio', { required: 'Bio is required' })}
                className="input-field"
                rows={4}
                placeholder="Tell us about yourself and your music"
              />
              {artistForm.formState.errors.bio && (
                <p className="text-red-500 text-sm mt-1">{artistForm.formState.errors.bio.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Registering...' : 'Register as Artist'}
            </button>
          </form>
        </div>
      )}

      {/* Track Upload Form */}
      {step === 'upload' && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <UploadIcon className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold">Upload Track</h2>
          </div>
          
          <form onSubmit={uploadForm.handleSubmit(onUploadSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Track Title
              </label>
              <input
                type="text"
                {...uploadForm.register('title', { required: 'Track title is required' })}
                className="input-field"
                placeholder="Enter track title"
              />
              {uploadForm.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{uploadForm.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                {...uploadForm.register('genre', { required: 'Genre is required' })}
                className="input-field"
              >
                <option value="">Select genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip Hop">Hip Hop</option>
                <option value="Electronic">Electronic</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Country">Country</option>
                <option value="R&B">R&B</option>
                <option value="Other">Other</option>
              </select>
              {uploadForm.formState.errors.genre && (
                <p className="text-red-500 text-sm mt-1">{uploadForm.formState.errors.genre.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  {...uploadForm.register('duration', { 
                    required: 'Duration is required',
                    min: { value: 1, message: 'Duration must be at least 1 second' }
                  })}
                  className="input-field"
                  placeholder="180"
                />
                {uploadForm.formState.errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{uploadForm.formState.errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Royalty Rate (%)
                </label>
                <input
                  type="number"
                  {...uploadForm.register('royaltyRate', { 
                    required: 'Royalty rate is required',
                    min: { value: 0, message: 'Royalty rate must be at least 0%' },
                    max: { value: 100, message: 'Royalty rate cannot exceed 100%' }
                  })}
                  className="input-field"
                  placeholder="10"
                />
                {uploadForm.formState.errors.royaltyRate && (
                  <p className="text-red-500 text-sm mt-1">{uploadForm.formState.errors.royaltyRate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IPFS Hash
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  {...uploadForm.register('ipfsHash', { required: 'IPFS hash is required' })}
                  className="input-field"
                  placeholder="QmHash..."
                />
                <button
                  type="button"
                  className="btn-secondary px-4 py-2"
                  onClick={() => {
                    // In a real app, this would open file upload and upload to IPFS
                    toast.info('File upload feature coming soon!')
                  }}
                >
                  <FileAudio className="h-4 w-4" />
                </button>
              </div>
              {uploadForm.formState.errors.ipfsHash && (
                <p className="text-red-500 text-sm mt-1">{uploadForm.formState.errors.ipfsHash.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Upload your audio file to IPFS and paste the hash here
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Uploading...' : 'Upload Track'}
            </button>
          </form>
        </div>
      )}

      {/* Info Card */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Music className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">How it works</h3>
            <p className="text-blue-700 text-sm mt-1">
              First, register as an artist to create your profile. Then upload your tracks with metadata. 
              Each time someone plays your track, you'll earn royalties automatically distributed through smart contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload