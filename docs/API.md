# Aptos Music Platform API Documentation

## Overview

The Aptos Music Platform API provides endpoints for interacting with the blockchain-based music platform. The API serves as a bridge between the frontend application and the Aptos blockchain.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://your-api-domain.com`

## Authentication

Currently, the API doesn't require authentication as it only provides read access to blockchain data. Write operations are handled directly through wallet transactions.

## Endpoints

### Health Check

**GET** `/api/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Music Platform API is running"
}
```

### Platform Statistics

**GET** `/api/stats`

Get platform-wide statistics.

**Response:**
```json
{
  "totalTracks": 150,
  "totalArtists": 25,
  "totalPlays": 15000,
  "platformEarnings": 5000000000
}
```

### Track Details

**GET** `/api/tracks/:id`

Get details of a specific track.

**Parameters:**
- `id` (string): Track ID

**Response:**
```json
{
  "id": "1",
  "title": "Midnight Dreams",
  "artist_address": "0x123...abc",
  "genre": "Electronic",
  "duration_ms": 180000,
  "ipfs_hash": "QmHash...",
  "royalty_rate": 1000,
  "play_count": 1250,
  "created_at": 1640995200,
  "is_active": true
}
```

### Artist Details

**GET** `/api/artists/:address`

Get details of a specific artist.

**Parameters:**
- `address` (string): Artist's wallet address

**Response:**
```json
{
  "address": "0x123...abc",
  "name": "Digital Dreams",
  "bio": "Electronic music producer",
  "total_tracks": 15,
  "total_earnings": 5000000000,
  "verified": true,
  "registered_at": 1640995200
}
```

### Playlist Details

**GET** `/api/playlists/:id`

Get details of a specific playlist.

**Parameters:**
- `id` (string): Playlist ID

**Response:**
```json
{
  "id": "1",
  "name": "Chill Vibes",
  "owner": "0x123...abc",
  "tracks": ["1", "2", "3"],
  "is_public": true,
  "created_at": 1640995200,
  "play_count": 450
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

Error responses include a message:

```json
{
  "error": "Track not found"
}
```

## Smart Contract Functions

The following Move functions are available in the smart contract:

### Artist Management

- `register_artist(name: String, bio: String)` - Register as an artist
- `verify_artist(artist_addr: address)` - Verify an artist (admin only)

### Track Management

- `upload_track(title: String, genre: String, duration_ms: u64, ipfs_hash: String, royalty_rate: u64)` - Upload a new track
- `create_remix(original_track_id: u64, remix_title: String, remix_genre: String, remix_duration_ms: u64, remix_ipfs_hash: String, original_royalty_share: u64)` - Create a remix

### Playback & Payments

- `play_track(track_id: u64, payment_amount: u64)` - Play a track and distribute royalties

### Playlist Management

- `create_playlist(name: String, is_public: bool)` - Create a new playlist
- `add_track_to_playlist(playlist_id: u64, track_id: u64)` - Add track to playlist

### View Functions

- `get_track(track_id: u64): Track` - Get track details
- `get_artist(artist_addr: address): Artist` - Get artist details
- `get_playlist(playlist_id: u64): Playlist` - Get playlist details
- `get_platform_stats(): (u64, u64, u64, u64)` - Get platform statistics

## Events

The smart contract emits the following events:

- `TrackUploadedEvent` - When a track is uploaded
- `TrackPlayedEvent` - When a track is played
- `RemixCreatedEvent` - When a remix is created
- `PlaylistCreatedEvent` - When a playlist is created

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

The API supports CORS for cross-origin requests from the frontend application.

## Deployment

To deploy the API:

1. Set environment variables in `.env`
2. Run `npm run build` in the backend directory
3. Start the server with `npm start`

## Monitoring

Consider implementing logging and monitoring for production deployment:

- Request/response logging
- Error tracking
- Performance monitoring
- Health checks