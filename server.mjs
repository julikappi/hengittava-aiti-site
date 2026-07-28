// Minimal zero-dependency static server for previewing index.html.
// Forwards CLI flags: npm run dev -- --port 7100 --host 0.0.0.0
// (On the Next.js port this file is deleted — `next dev` takes over.)
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const eq = args.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.split('=')[1];
  const i = args.indexOf(`--${name}`);
  if (i > -1 && args[i + 1]) return args[i + 1];
  return process.env[name.toUpperCase()] ?? fallback;
};

const port = Number(opt('port', 7100));
const host = opt('host', '0.0.0.0');
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') pathname = '/index.html';
    if (pathname.endsWith('/')) pathname += 'index.html';
    let file = normalize(join(root, pathname));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }
    let data;
    try {
      data = await readFile(file);
    } catch (err) {
      if (!extname(file)) {
        file = normalize(join(root, pathname, 'index.html'));
        if (!file.startsWith(root)) {
          res.writeHead(403);
          return res.end('Forbidden');
        }
        data = await readFile(file);
      } else {
        throw err;
      }
    }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(port, host, () => {
  console.log(`Hengittävä Äiti preview → http://localhost:${port}`);
});
