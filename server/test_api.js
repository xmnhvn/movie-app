const fetch = globalThis.fetch || require('node-fetch');
const { startServer } = require('./index');

const PORT = 8000;
const base = `http://127.0.0.1:${PORT}/api`;

async function req(path, opts = {}) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch (e) {}
  return { status: res.status, body };
}

(async function run() {
  try {
    // Start the API server programmatically to avoid terminal session conflicts
    const server = startServer(PORT);
    // Wait until /api/health responds or timeout after ~3s
    const deadline = Date.now() + 3000;
    while (true) {
      try {
        const r = await req('/health');
        if (r.status === 200) break;
      } catch {}
      if (Date.now() > deadline) {
        console.error('Server did not become healthy in time');
        server && server.close && server.close();
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 100));
    }

    console.log('Testing API against', base);

    // 1) Signup (may return 409 if exists)
    console.log('\n1) Signup user testuser_agent');
    let r = await req('/auth/signup', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'testuser_agent', password: 'secret' }) });
    console.log('signup status', r.status, 'body:', r.body);

    // If conflict, try login
    if (r.status === 409 || r.status === 500) {
      console.log('Signup failed/exists — attempting login');
      r = await req('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'testuser_agent', password: 'secret' }) });
      console.log('login status', r.status, 'body:', r.body);
    } else if (r.status === 200) {
      // signed up and got user
      console.log('Signed up OK');
    } else {
      console.log('Unexpected signup status — trying login anyway');
      r = await req('/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'testuser_agent', password: 'secret' }) });
      console.log('login status', r.status, 'body:', r.body);
    }

    const token = r.body && r.body.token ? r.body.token : (r.body && r.body.token ? r.body.token : null);
    const user = r.body && r.body.user ? r.body.user : (r.body && r.body.id ? r.body : null);
    if (!user || !user.id) {
      console.error('Could not obtain user id from signup/login response. Exiting.');
      process.exit(1);
    }
    console.log('Using user id:', user.id, ' token:', Boolean(token));

    // helper to include token header when set
    const authHeaders = (extra = {}) => {
      const h = { 'content-type': 'application/json', ...extra };
      if (token) h.authorization = `Bearer ${token}`;
      return h;
    };

  // 2) Add to watchlist — first time (server uses token to identify user)
  const movie = { id: 'movie-123', title: 'Test Movie', poster: 'http://example.com/poster.jpg' };
  console.log('\n2) Add to watchlist (first time)');
  let a = await req('/watchlist', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ movie }) });
  console.log('add1 status', a.status, 'body:', a.body);

  // 3) Add to watchlist — second time (should dedupe)
  console.log('\n3) Add to watchlist (second time)');
  let b = await req('/watchlist', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ movie }) });
  console.log('add2 status', b.status, 'body:', b.body);

  // 4) Get watchlist
  console.log('\n4) Get watchlist');
  const g = await req(`/watchlist`, { headers: authHeaders() });
  console.log('get status', g.status, 'body:', g.body);

    console.log('\nTest script finished.');
    // Gracefully stop the server after tests
    server && server.close && server.close();
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
})();
