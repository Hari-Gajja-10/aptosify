const express = require("express");
const cors = require("cors");
const { AptosClient } = require("aptos");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Aptos client
const client = new AptosClient(process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com");
const MODULE_ADDRESS = process.env.MODULE_ADDRESS;

// Routes
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Music Platform API is running" });
});

// Get platform statistics
app.get("/api/stats", async (req, res) => {
    try {
        const payload = {
            function: `${MODULE_ADDRESS}::players::get_platform_stats`,
            type_arguments: [],
            arguments: []
        };
        
        const result = await client.view(payload);
        const [totalTracks, totalArtists, totalPlays, platformEarnings] = result;
        
        res.json({
            totalTracks: parseInt(totalTracks),
            totalArtists: parseInt(totalArtists),
            totalPlays: parseInt(totalPlays),
            platformEarnings: parseInt(platformEarnings)
        });
    } catch (error) {
        console.error("Error fetching platform stats:", error);
        res.status(500).json({ error: "Failed to fetch platform statistics" });
    }
});

// Get track details
app.get("/api/tracks/:id", async (req, res) => {
    try {
        const trackId = req.params.id;
        const payload = {
            function: `${MODULE_ADDRESS}::players::get_track`,
            type_arguments: [],
            arguments: [trackId]
        };
        
        const result = await client.view(payload);
        res.json(result);
    } catch (error) {
        console.error("Error fetching track:", error);
        res.status(404).json({ error: "Track not found" });
    }
});

// Get artist details
app.get("/api/artists/:address", async (req, res) => {
    try {
        const artistAddress = req.params.address;
        const payload = {
            function: `${MODULE_ADDRESS}::players::get_artist`,
            type_arguments: [],
            arguments: [artistAddress]
        };
        
        const result = await client.view(payload);
        res.json(result);
    } catch (error) {
        console.error("Error fetching artist:", error);
        res.status(404).json({ error: "Artist not found" });
    }
});

// Get playlist details
app.get("/api/playlists/:id", async (req, res) => {
    try {
        const playlistId = req.params.id;
        const payload = {
            function: `${MODULE_ADDRESS}::players::get_playlist`,
            type_arguments: [],
            arguments: [playlistId]
        };
        
        const result = await client.view(payload);
        res.json(result);
    } catch (error) {
        console.error("Error fetching playlist:", error);
        res.status(404).json({ error: "Playlist not found" });
    }
});

// Get all tracks (simplified - in production you'd want pagination)
app.get("/api/tracks", async (req, res) => {
    try {
        // This is a simplified implementation
        // In a real app, you'd want to store track metadata off-chain
        // and only use the blockchain for ownership and payments
        res.json({ 
            message: "Use individual track endpoints or implement off-chain storage for listing",
            tracks: []
        });
    } catch (error) {
        console.error("Error fetching tracks:", error);
        res.status(500).json({ error: "Failed to fetch tracks" });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🎵 Music Platform API running on port ${PORT}`);
    console.log(`📡 Aptos Node: ${process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com"}`);
    console.log(`🏗️  Module Address: ${MODULE_ADDRESS || "Not set"}`);
});