// Homemade GHL posts are rejected (Cloudflare Turnstile / missing-input-response).
// /kun-huusit/ now embeds the official widget instead of this proxy.
module.exports = async function handler(req, res) {
  res.statusCode = 410;
  res.setHeader('Allow', 'GET, POST');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify({
    error: true,
    message: 'Use the official GHL widget on /kun-huusit/',
  }));
};
