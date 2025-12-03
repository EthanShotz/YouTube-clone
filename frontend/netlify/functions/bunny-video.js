const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const BUNNY_LIBRARY_ID = "554184";

const RANDOM_USERNAMES = [
  "TechWizard42", "SkylineVibes", "PixelDreamer", "CosmicCoder", "NeonNinja",
  "CloudSurfer99", "QuantumLeap", "MidnightOwl", "SilverFox_TV", "ThunderBolt",
  "CrystalWave", "PhoenixRise", "VelvetStorm", "ArcticFlame", "GoldenEcho",
  "ShadowPulse", "NovaStream", "ZenMaster_X", "ElectricSoul", "WildCard_Pro"
];

const getRandomUsername = (guid) => {
  let hash = 0;
  for (let i = 0; i < guid.length; i++) {
    hash = ((hash << 5) - hash) + guid.charCodeAt(i);
    hash = hash & hash;
  }
  return RANDOM_USERNAMES[Math.abs(hash) % RANDOM_USERNAMES.length];
};

exports.handler = async (event, context) => {
  const guid = event.queryStringParameters?.guid;

  if (!guid) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "Missing guid parameter" })
    };
  }

  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${guid}`,
      {
        headers: {
          'accept': 'application/json',
          'AccessKey': BUNNY_ACCESS_KEY
        }
      }
    );

    if (!response.ok) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Video not found" })
      };
    }

    const video = await response.json();

    const formattedVideo = {
      _id: video.guid,
      videoURL: `https://vz-f7a6f94e-08a.b-cdn.net/${video.guid}/playlist.m3u8`,
      thumbnailURL: `/.netlify/functions/thumbnail?guid=${video.guid}`,
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(formattedVideo)
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: "An error occurred" })
    };
  }
};
