# Aptos Music Platform

A decentralized music platform built on the Aptos blockchain that allows artists to upload tracks, create remixes, and earn royalties through smart contracts.

## Features

- **Artist Registration**: Artists can register on the platform and get verified
- **Track Upload**: Upload music tracks with metadata and IPFS storage
- **Remix Creation**: Create remixes of existing tracks with automatic royalty distribution
- **Playlist Management**: Create and manage public/private playlists
- **Royalty Distribution**: Automatic royalty payments to original and remix artists
- **Platform Analytics**: Track plays, earnings, and platform statistics

## Project Structure

```
aptos-music-platform/
├── frontend/                 # React frontend application
├── backend/                  # Aptos Move contract and deployment scripts
├── contracts/               # Move smart contracts
└── docs/                    # Documentation
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Aptos CLI
- Petra Wallet or other Aptos wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aptos-music-platform
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Deploy the smart contract:
```bash
npm run deploy
```

5. Start the development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Smart Contract Features

### Core Functions

- `initialize()`: Initialize the music platform
- `register_artist()`: Register as an artist
- `upload_track()`: Upload a new music track
- `create_remix()`: Create a remix of an existing track
- `play_track()`: Play a track and distribute royalties
- `create_playlist()`: Create a new playlist
- `add_track_to_playlist()`: Add tracks to playlists

### Royalty System

- Platform fee: 5% of all transactions
- Artist royalties: Configurable per track (up to 100%)
- Remix royalties: Automatic distribution between original and remix artists

## Frontend Features

- Modern React application with TypeScript
- Wallet integration (Petra, Martian, etc.)
- Track upload and management
- Playlist creation and management
- Artist profile management
- Real-time analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
