import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import { Music, Home, Search, Upload, User, Wallet } from 'lucide-react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connected, connect, disconnect, address } = useWallet()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Aptos Music</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {connected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </div>
                  <button
                    onClick={disconnect}
                    className="btn-secondary text-sm"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <nav className="flex justify-around py-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {children}
      </main>
    </div>
  )
}

export default Layout