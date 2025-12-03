exports.handler = async (event, context) => {
  const guid = event.queryStringParameters?.guid;

  if (!guid) {
    return {
      statusCode: 400,
      body: 'Missing guid parameter'
    };
  }

  try {
    const thumbnailUrl = `https://vz-f7a6f94e-08a.b-cdn.net/${guid}/thumbnail.jpg`;

    const response = await fetch(thumbnailUrl);

    if (!response.ok) {
      // Return placeholder for private videos
      return {
        statusCode: 302,
        headers: {
          'Location': 'https://placehold.co/640x360/1a1a1a/ffffff?text=Video'
        }
      };
    }

    const buffer = await response.arrayBuffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://placehold.co/640x360/1a1a1a/ffffff?text=Video'
      }
    };
  }
};
