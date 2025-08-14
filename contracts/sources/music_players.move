module music_players::players {
    use std::signer;
    use std::vector;
    use std::string::String;
    use std::option::Option;
    use aptos_framework::timestamp;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::event;

    // Error codes
    /// Not authorized to perform this action
    const E_NOT_AUTHORIZED: u64 = 1;
    /// Track does not exist
    const E_TRACK_NOT_EXISTS: u64 = 2;
    /// Artist does not exist
    const E_ARTIST_NOT_EXISTS: u64 = 3;
    /// Insufficient balance for the transaction
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    /// Invalid royalty rate provided
    const E_INVALID_ROYALTY_RATE: u64 = 5;
    /// Track already exists
    const E_TRACK_ALREADY_EXISTS: u64 = 6;
    /// Playlist does not exist
    const E_PLAYLIST_NOT_EXISTS: u64 = 7;
    /// Invalid track duration
    const E_INVALID_DURATION: u64 = 8;
    /// Artist already exists
    const E_ARTIST_ALREADY_EXISTS: u64 = 9;

    // Constants
    const MAX_ROYALTY_RATE: u64 = 10000; // 100% in basis points (100 basis points = 1%)
    const PLATFORM_FEE_RATE: u64 = 500; // 5% platform fee
    const MIN_TRACK_DURATION: u64 = 1000; // 1 second in milliseconds

    // Structs
    struct Track has store, copy, drop {
        id: u64,
        title: String,
        artist_address: address,
        genre: String,
        duration_ms: u64, // Duration in milliseconds
        ipfs_hash: String, // IPFS hash for the audio file
        royalty_rate: u64, // Royalty rate in basis points (e.g., 1000 = 10%)
        play_count: u64,
        created_at: u64,
        is_active: bool,
    }

    struct Artist has store, copy, drop {
        address: address,
        name: String,
        bio: String,
        total_tracks: u64,
        total_earnings: u64,
        verified: bool,
        registered_at: u64,
    }

    struct Playlist has store, copy, drop {
        id: u64,
        name: String,
        owner: address,
        tracks: vector<u64>, // Track IDs
        is_public: bool,
        created_at: u64,
        play_count: u64,
    }

    struct PlaySession has store, copy, drop {
        track_id: u64,
        listener: address,
        started_at: u64,
        duration_played: u64, // How long the track was played
        is_remix: bool,
        original_track_id: Option<u64>, // If this is a remix, reference to original
    }

    struct RemixInfo has store, copy, drop {
        remix_track_id: u64,
        original_track_id: u64,
        remix_artist: address,
        original_artist: address,
        original_royalty_share: u64, // Percentage of royalties going to original artist
    }

    // Global state
    struct MusicPlatform has key {
        admin: address,
        next_track_id: u64,
        next_playlist_id: u64,
        tracks: vector<Track>,
        artists: vector<Artist>,
        playlists: vector<Playlist>,
        remixes: vector<RemixInfo>,
        platform_earnings: u64,
        total_plays: u64,
    }

    // Events
    #[event]
    struct TrackUploadedEvent has drop, store {
        track_id: u64,
        artist: address,
        title: String,
        timestamp: u64,
    }

    #[event]
    struct TrackPlayedEvent has drop, store {
        track_id: u64,
        listener: address,
        artist: address,
        royalty_paid: u64,
        timestamp: u64,
    }

    #[event]
    struct RemixCreatedEvent has drop, store {
        remix_track_id: u64,
        original_track_id: u64,
        remix_artist: address,
        original_artist: address,
        timestamp: u64,
    }

    #[event]
    struct PlaylistCreatedEvent has drop, store {
        playlist_id: u64,
        owner: address,
        name: String,
        timestamp: u64,
    }

    // Initialize the music platform
    public entry fun initialize(admin: &signer) {
        let admin_addr = signer::address_of(admin);
        
        let platform = MusicPlatform {
            admin: admin_addr,
            next_track_id: 1,
            next_playlist_id: 1,
            tracks: vector::empty<Track>(),
            artists: vector::empty<Artist>(),
            playlists: vector::empty<Playlist>(),
            remixes: vector::empty<RemixInfo>(),
            platform_earnings: 0,
            total_plays: 0,
        };
        
        move_to(admin, platform);
    }

    // Register as an artist
    public entry fun register_artist(
        account: &signer,
        name: String,
        bio: String
    ) acquires MusicPlatform {
        let account_addr = signer::address_of(account);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        // Check if artist already exists
        let i = 0;
        let len = vector::length(&platform.artists);
        while (i < len) {
            let artist = vector::borrow(&platform.artists, i);
            assert!(artist.address != account_addr, E_ARTIST_ALREADY_EXISTS);
            i = i + 1;
        };
        
        let new_artist = Artist {
            address: account_addr,
            name,
            bio,
            total_tracks: 0,
            total_earnings: 0,
            verified: false,
            registered_at: timestamp::now_seconds(),
        };
        
        vector::push_back(&mut platform.artists, new_artist);
    }

    // Upload a new track
    public entry fun upload_track(
        artist: &signer,
        title: String,
        genre: String,
        duration_ms: u64,
        ipfs_hash: String,
        royalty_rate: u64
    ) acquires MusicPlatform {
        let artist_addr = signer::address_of(artist);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        assert!(duration_ms >= MIN_TRACK_DURATION, E_INVALID_DURATION);
        assert!(royalty_rate <= MAX_ROYALTY_RATE, E_INVALID_ROYALTY_RATE);
        
        // Verify artist is registered
        let artist_exists = false;
        let i = 0;
        let len = vector::length(&platform.artists);
        while (i < len) {
            let existing_artist = vector::borrow_mut(&mut platform.artists, i);
            if (existing_artist.address == artist_addr) {
                existing_artist.total_tracks = existing_artist.total_tracks + 1;
                artist_exists = true;
                break
            };
            i = i + 1;
        };
        assert!(artist_exists, E_ARTIST_NOT_EXISTS);
        
        let track_id = platform.next_track_id;
        let new_track = Track {
            id: track_id,
            title,
            artist_address: artist_addr,
            genre,
            duration_ms,
            ipfs_hash,
            royalty_rate,
            play_count: 0,
            created_at: timestamp::now_seconds(),
            is_active: true,
        };
        
        vector::push_back(&mut platform.tracks, new_track);
        platform.next_track_id = platform.next_track_id + 1;
        
        // Emit event
        event::emit(TrackUploadedEvent {
            track_id,
            artist: artist_addr,
            title,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Create a remix of an existing track
    public entry fun create_remix(
        remix_artist: &signer,
        original_track_id: u64,
        remix_title: String,
        remix_genre: String,
        remix_duration_ms: u64,
        remix_ipfs_hash: String,
        original_royalty_share: u64 // Percentage of royalties for original artist
    ) acquires MusicPlatform {
        let remix_artist_addr = signer::address_of(remix_artist);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        assert!(remix_duration_ms >= MIN_TRACK_DURATION, E_INVALID_DURATION);
        assert!(original_royalty_share <= MAX_ROYALTY_RATE, E_INVALID_ROYALTY_RATE);
        
        // Find original track
        let original_track_found = false;
        let original_artist_addr = @0x0;
        let i = 0;
        let len = vector::length(&platform.tracks);
        while (i < len) {
            let track = vector::borrow(&platform.tracks, i);
            if (track.id == original_track_id && track.is_active) {
                original_track_found = true;
                original_artist_addr = track.artist_address;
                break
            };
            i = i + 1;
        };
        assert!(original_track_found, E_TRACK_NOT_EXISTS);
        
        // Verify remix artist is registered
        let remix_artist_exists = false;
        let i = 0;
        let len = vector::length(&platform.artists);
        while (i < len) {
            let artist = vector::borrow_mut(&mut platform.artists, i);
            if (artist.address == remix_artist_addr) {
                artist.total_tracks = artist.total_tracks + 1;
                remix_artist_exists = true;
                break
            };
            i = i + 1;
        };
        assert!(remix_artist_exists, E_ARTIST_NOT_EXISTS);
        
        // Create remix track
        let remix_track_id = platform.next_track_id;
        let remix_track = Track {
            id: remix_track_id,
            title: remix_title,
            artist_address: remix_artist_addr,
            genre: remix_genre,
            duration_ms: remix_duration_ms,
            ipfs_hash: remix_ipfs_hash,
            royalty_rate: 1000, // Default 10% royalty
            play_count: 0,
            created_at: timestamp::now_seconds(),
            is_active: true,
        };
        
        vector::push_back(&mut platform.tracks, remix_track);
        platform.next_track_id = platform.next_track_id + 1;
        
        // Create remix info
        let remix_info = RemixInfo {
            remix_track_id,
            original_track_id,
            remix_artist: remix_artist_addr,
            original_artist: original_artist_addr,
            original_royalty_share,
        };
        
        vector::push_back(&mut platform.remixes, remix_info);
        
        // Emit event
        event::emit(RemixCreatedEvent {
            remix_track_id,
            original_track_id,
            remix_artist: remix_artist_addr,
            original_artist: original_artist_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Play a track and distribute royalties
    public entry fun play_track(
        listener: &signer,
        track_id: u64,
        payment_amount: u64
    ) acquires MusicPlatform {
        let listener_addr = signer::address_of(listener);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        // Check if listener has sufficient balance
        let listener_balance = coin::balance<AptosCoin>(listener_addr);
        assert!(listener_balance >= payment_amount, E_INSUFFICIENT_BALANCE);
        
        // Find the track
        let track_found = false;
        let track_index = 0;
        let artist_addr = @0x0;
        let i = 0;
        let len = vector::length(&platform.tracks);
        while (i < len) {
            let track = vector::borrow(&platform.tracks, i);
            if (track.id == track_id && track.is_active) {
                track_found = true;
                track_index = i;
                artist_addr = track.artist_address;
                break
            };
            i = i + 1;
        };
        assert!(track_found, E_TRACK_NOT_EXISTS);
        
        // Calculate payments
        let platform_fee = (payment_amount * PLATFORM_FEE_RATE) / MAX_ROYALTY_RATE;
        let remaining_amount = payment_amount - platform_fee;
        
        // Check if this is a remix and handle payments accordingly
        let remix_artist_payment = remaining_amount;
        let i = 0;
        let remixes_len = vector::length(&platform.remixes);
        while (i < remixes_len) {
            let remix_info = vector::borrow(&platform.remixes, i);
            if (remix_info.remix_track_id == track_id) {
                let original_artist_payment = (remaining_amount * remix_info.original_royalty_share) / MAX_ROYALTY_RATE;
                remix_artist_payment = remaining_amount - original_artist_payment;
                
                // Pay original artist
                if (original_artist_payment > 0) {
                    coin::transfer<AptosCoin>(listener, remix_info.original_artist, original_artist_payment);
                    
                    // Update original artist earnings
                    let j = 0;
                    let artists_len = vector::length(&platform.artists);
                    while (j < artists_len) {
                        let artist = vector::borrow_mut(&mut platform.artists, j);
                        if (artist.address == remix_info.original_artist) {
                            artist.total_earnings = artist.total_earnings + original_artist_payment;
                            break
                        };
                        j = j + 1;
                    };
                };
                break
            };
            i = i + 1;
        };
        
        // Pay remix artist or main artist
        if (remix_artist_payment > 0) {
            coin::transfer<AptosCoin>(listener, artist_addr, remix_artist_payment);
            
            // Update artist earnings
            let i = 0;
            let len = vector::length(&platform.artists);
            while (i < len) {
                let artist = vector::borrow_mut(&mut platform.artists, i);
                if (artist.address == artist_addr) {
                    artist.total_earnings = artist.total_earnings + remix_artist_payment;
                    break
                };
                i = i + 1;
            };
        };
        
        // Pay platform fee
        if (platform_fee > 0) {
            coin::transfer<AptosCoin>(listener, platform.admin, platform_fee);
            platform.platform_earnings = platform.platform_earnings + platform_fee;
        };
        
        // Update track play count
        let track = vector::borrow_mut(&mut platform.tracks, track_index);
        track.play_count = track.play_count + 1;
        platform.total_plays = platform.total_plays + 1;
        
        // Emit event
        event::emit(TrackPlayedEvent {
            track_id,
            listener: listener_addr,
            artist: artist_addr,
            royalty_paid: remaining_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Create a playlist
    public entry fun create_playlist(
        owner: &signer,
        name: String,
        is_public: bool
    ) acquires MusicPlatform {
        let owner_addr = signer::address_of(owner);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        let playlist_id = platform.next_playlist_id;
        let new_playlist = Playlist {
            id: playlist_id,
            name,
            owner: owner_addr,
            tracks: vector::empty<u64>(),
            is_public,
            created_at: timestamp::now_seconds(),
            play_count: 0,
        };
        
        vector::push_back(&mut platform.playlists, new_playlist);
        platform.next_playlist_id = platform.next_playlist_id + 1;
        
        // Emit event
        event::emit(PlaylistCreatedEvent {
            playlist_id,
            owner: owner_addr,
            name,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Add track to playlist
    public entry fun add_track_to_playlist(
        owner: &signer,
        playlist_id: u64,
        track_id: u64
    ) acquires MusicPlatform {
        let owner_addr = signer::address_of(owner);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        // Verify track exists
        let track_exists = false;
        let i = 0;
        let len = vector::length(&platform.tracks);
        while (i < len) {
            let track = vector::borrow(&platform.tracks, i);
            if (track.id == track_id && track.is_active) {
                track_exists = true;
                break
            };
            i = i + 1;
        };
        assert!(track_exists, E_TRACK_NOT_EXISTS);
        
        // Find and update playlist
        let playlist_found = false;
        let i = 0;
        let len = vector::length(&platform.playlists);
        while (i < len) {
            let playlist = vector::borrow_mut(&mut platform.playlists, i);
            if (playlist.id == playlist_id && playlist.owner == owner_addr) {
                vector::push_back(&mut playlist.tracks, track_id);
                playlist_found = true;
                break
            };
            i = i + 1;
        };
        assert!(playlist_found, E_PLAYLIST_NOT_EXISTS);
    }

    // Get track details
    #[view]
    public fun get_track(track_id: u64): Track acquires MusicPlatform {
        let platform = borrow_global<MusicPlatform>(@music_players);
        
        let i = 0;
        let len = vector::length(&platform.tracks);
        while (i < len) {
            let track = vector::borrow(&platform.tracks, i);
            if (track.id == track_id) {
                return *track
            };
            i = i + 1;
        };
        
        abort E_TRACK_NOT_EXISTS
    }

    // Get artist details
    #[view]
    public fun get_artist(artist_addr: address): Artist acquires MusicPlatform {
        let platform = borrow_global<MusicPlatform>(@music_players);
        
        let i = 0;
        let len = vector::length(&platform.artists);
        while (i < len) {
            let artist = vector::borrow(&platform.artists, i);
            if (artist.address == artist_addr) {
                return *artist
            };
            i = i + 1;
        };
        
        abort E_ARTIST_NOT_EXISTS
    }

    // Get playlist details
    #[view]
    public fun get_playlist(playlist_id: u64): Playlist acquires MusicPlatform {
        let platform = borrow_global<MusicPlatform>(@music_players);
        
        let i = 0;
        let len = vector::length(&platform.playlists);
        while (i < len) {
            let playlist = vector::borrow(&platform.playlists, i);
            if (playlist.id == playlist_id) {
                return *playlist
            };
            i = i + 1;
        };
        
        abort E_PLAYLIST_NOT_EXISTS
    }

    // Get platform statistics
    #[view]
    public fun get_platform_stats(): (u64, u64, u64, u64) acquires MusicPlatform {
        let platform = borrow_global<MusicPlatform>(@music_players);
        (
            vector::length(&platform.tracks),
            vector::length(&platform.artists),
            platform.total_plays,
            platform.platform_earnings
        )
    }

    // Admin function to verify artist
    public entry fun verify_artist(
        admin: &signer,
        artist_addr: address
    ) acquires MusicPlatform {
        let admin_addr = signer::address_of(admin);
        let platform = borrow_global_mut<MusicPlatform>(@music_players);
        
        assert!(admin_addr == platform.admin, E_NOT_AUTHORIZED);
        
        let i = 0;
        let len = vector::length(&platform.artists);
        while (i < len) {
            let artist = vector::borrow_mut(&mut platform.artists, i);
            if (artist.address == artist_addr) {
                artist.verified = true;
                return
            };
            i = i + 1;
        };
        
        abort E_ARTIST_NOT_EXISTS
    }
}