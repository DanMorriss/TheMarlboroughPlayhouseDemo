// Local stand-in for Vercel's /api functions, used by `npm run dev`.
// `ng serve` proxies /api requests here (see proxy.conf.json).
// Reads BOOKWHEN_API_TOKEN from .env.local via `node --env-file`.
import { createServer } from 'node:http';

const PORT = 3001;
const { GET: events } = await import('../api/events.ts');
const routes = { '/api/events': events };

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const handler = routes[url.pathname];
  if (!handler || req.method !== 'GET') {
    res.writeHead(404).end();
    return;
  }
  try {
    const response = await handler(new Request(url));
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(await response.text());
  } catch (error) {
    console.error(error);
    res.writeHead(500).end();
  }
}).listen(PORT, () => console.log(`Local API running on http://localhost:${PORT}`));
