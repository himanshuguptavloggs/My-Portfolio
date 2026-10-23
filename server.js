const fs = require('fs');
const path = require('path');
const http = require('http');

const projectRoot = __dirname;
const envFilePath = path.join(projectRoot, '.env');

function loadEnv() {
  if (!fs.existsSync(envFilePath)) return;

  const contents = fs.readFileSync(envFilePath, 'utf8');
  const lines = contents.split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    const separatorIndex = line.indexOf('=');
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value.replace(/^['"]|['"]$/g, '');
    }
  }
}

loadEnv();

const DEFAULT_PORT = 3000;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_HANDLE = 'himanshuguptavloggs';

if (!YOUTUBE_API_KEY) {
  console.error('Missing YOUTUBE_API_KEY in .env');
  process.exit(1);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

async function fetchYouTubeVideos(handle) {
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${YOUTUBE_API_KEY}`;
  const channelResponse = await fetch(channelUrl);
  const channelData = await channelResponse.json();

  if (!channelResponse.ok || !channelData.items || channelData.items.length === 0) {
    throw new Error(channelData.error?.message || 'Unable to find the YouTube channel.');
  }

  const channelId = channelData.items[0].id;
  const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=20&key=${YOUTUBE_API_KEY}`;
  const videosResponse = await fetch(videosUrl);
  const videosData = await videosResponse.json();

  if (!videosResponse.ok) {
    throw new Error(videosData.error?.message || 'Unable to fetch YouTube videos.');
  }

  return (videosData.items || []).map((item) => ({
    title: item.snippet.title,
    videoId: item.id.videoId,
    link: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }));
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, 'http://localhost');

  if (requestUrl.pathname === '/api/youtube') {
    const handle = requestUrl.searchParams.get('handle') || YOUTUBE_HANDLE;

    try {
      const items = await fetchYouTubeVideos(handle);
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
      });
      res.end(JSON.stringify({ items }));
      return;
    } catch (error) {
      console.error('YouTube API error:', error);
      res.writeHead(500, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      res.end(JSON.stringify({
        error: 'Unable to load YouTube videos right now.'
      }));
      return;
    }
  }

  const relativePath = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
  const requestedPath = path.normalize(path.join(projectRoot, relativePath));

  if (!requestedPath.startsWith(projectRoot)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(requestedPath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    fs.readFile(requestedPath, (readError, content) => {
      if (readError) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': getContentType(requestedPath) });
      res.end(content);
    });
  });
});

const port = Number(process.env.PORT || DEFAULT_PORT);
server.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`);
});
