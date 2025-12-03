const BUNNY_ACCESS_KEY = process.env.BUNNY_ACCESS_KEY;
const BUNNY_LIBRARY_ID = "554184";
const BUNNY_COLLECTION_ID = "7c4365ea-85bf-45ee-b822-22960971a088";

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
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos?collection=${BUNNY_COLLECTION_ID}&itemsPerPage=100`,
      {
        headers: {
          'accept': 'application/json',
          'AccessKey': BUNNY_ACCESS_KEY
        }
      }
    );

    const data = await response.json();
    const videos = data.items || [];

    const formattedVideos = videos.map(video => ({
      guid: video.guid,
      title: video.title,
      length: video.length,
      views: video.views || 0,
      dateUploaded: video.dateUploaded,
      thumbnailUrl: `/.netlify/functions/thumbnail?guid=${video.guid}`,
      channelName: getRandomUsername(video.guid)
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ items: formattedVideos })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error occurred" })
    };
  }
};
