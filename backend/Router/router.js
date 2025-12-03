require("dotenv").config();
// require("../Database/database"); // Disabled for prop mode
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require("axios");

// Bunny.net API configuration
const BUNNY_ACCESS_KEY = "de0c5d7a-0402-4127-a55621c98177-d3aa-48d0";
const BUNNY_LIBRARY_ID = "554184";
const BUNNY_COLLECTION_ID = "7c4365ea-85bf-45ee-b822-22960971a088";
const BUNNY_CDN_HOSTNAME = "vz-cac74041-8b3.b-cdn.net";

// Random usernames for video channels
const RANDOM_USERNAMES = [
  "TechWizard42",
  "SkylineVibes",
  "PixelDreamer",
  "CosmicCoder",
  "NeonNinja",
  "CloudSurfer99",
  "QuantumLeap",
  "MidnightOwl",
  "SilverFox_TV",
  "ThunderBolt",
  "CrystalWave",
  "PhoenixRise",
  "VelvetStorm",
  "ArcticFlame",
  "GoldenEcho",
  "ShadowPulse",
  "NovaStream",
  "ZenMaster_X",
  "ElectricSoul",
  "WildCard_Pro"
];

// Get consistent random username based on video guid
const getRandomUsername = (guid) => {
  let hash = 0;
  for (let i = 0; i < guid.length; i++) {
    hash = ((hash << 5) - hash) + guid.charCodeAt(i);
    hash = hash & hash;
  }
  return RANDOM_USERNAMES[Math.abs(hash) % RANDOM_USERNAMES.length];
};

// Middlewares
router.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
    credentials: true,
  })
);
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Bunny.net videos endpoint - fetch videos from collection
router.get("/bunny-videos", async (req, res) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: BUNNY_ACCESS_KEY
      }
    };

    // Fetch videos from the library filtered by collection
    const response = await axios.get(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?collection=${BUNNY_COLLECTION_ID}&itemsPerPage=100`,
      options
    );

    // Transform videos to the format expected by the frontend
    const videos = response.data.items || [];
    const formattedVideos = videos.map(video => ({
      guid: video.guid,
      title: video.title,
      length: video.length,
      views: video.views || 0,
      dateUploaded: video.dateUploaded,
      // Use proxy endpoint for thumbnails (handles private videos)
      thumbnailUrl: `http://localhost:3000/thumbnail/${video.guid}`,
      channelName: getRandomUsername(video.guid)
    }));

    res.json({ items: formattedVideos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Get single Bunny video by GUID for video playback
router.get("/bunny-video/:guid", async (req, res) => {
  try {
    const { guid } = req.params;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AccessKey: BUNNY_ACCESS_KEY
      }
    };

    const response = await axios.get(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${guid}`,
      options
    );

    const video = response.data;

    // Transform to the format expected by the frontend VideoSection
    const formattedVideo = {
      _id: video.guid,
      videoURL: `https://vz-f7a6f94e-08a.b-cdn.net/${video.guid}/playlist.m3u8`,
      thumbnailURL: `http://localhost:3000/thumbnail/${video.guid}`,
      Title: video.title,
      Description: video.metaTags?.find(tag => tag.property === "description")?.value || "",
      uploader: getRandomUsername(video.guid),
      ChannelProfile: "https://via.placeholder.com/40",
      views: video.views || 0,
      likes: 0,
      videoLength: video.length,
      uploaded_date: video.dateUploaded,
      visibility: "Public",
      comments: [],
      isBunnyVideo: true
    };

    res.json(formattedVideo);
  } catch (error) {
    console.error(error);
    if (error.response?.status === 404) {
      res.status(404).json({ message: "Video not found" });
    } else {
      res.status(500).json({ message: "An error occurred" });
    }
  }
});

// Proxy endpoint for Bunny video thumbnails
// Note: For private videos, thumbnails require signed URLs or public video settings
router.get("/thumbnail/:guid", async (req, res) => {
  try {
    const { guid } = req.params;
    // Try to fetch from CDN (works if video is public)
    const thumbnailUrl = `https://vz-f7a6f94e-08a.b-cdn.net/${guid}/thumbnail.jpg`;

    const response = await axios.get(thumbnailUrl, {
      responseType: 'arraybuffer',
      timeout: 5000
    });

    res.set('Content-Type', 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(response.data);
  } catch (error) {
    // For private videos, return a video-themed placeholder
    res.redirect(`https://placehold.co/640x360/1a1a1a/ffffff?text=Video`);
  }
});

// Mock endpoints to prevent frontend errors
router.get("/userdata", (req, res) => res.json(null));
router.get("/getchannel/:email", (req, res) => res.json({}));
router.get("/getvideos", (req, res) => res.json([]));

module.exports = router;
