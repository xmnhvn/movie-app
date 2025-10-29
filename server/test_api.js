const fetch = globalThis.fetch || require('node-fetch');

const base = 'http://127.0.0.1:8000/api';

async function req(path, opts = {}) {
  const res = await fetch(base + path, opts);
  const text = await res.text();
  let body = text;
  try { body = JSON.parse(text); } catch (e) {}
  return { status: res.status, body };
}

(async function run() {
  try {
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

    // 2) Add to watchlist — first time
    const movie = { id: 'movie-123', title: 'Test Movie', poster: 'http://example.com/poster.jpg' };
    console.log('\n2) Add to watchlist (first time)');
    let a = await req('/watchlist', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ userId: user.id, movie }) });
    console.log('add1 status', a.status, 'body:', a.body);

    // 3) Add to watchlist — second time
    console.log('\n3) Add to watchlist (second time)');
    let b = await req('/watchlist', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ userId: user.id, movie }) });
    console.log('add2 status', b.status, 'body:', b.body);

    // 4) Get watchlist
    console.log('\n4) Get watchlist');
    const g = await req(`/watchlist/${user.id}`, { headers: authHeaders() });
    console.log('get status', g.status, 'body:', g.body);

    console.log('\nTest script finished.');
  } catch (err) {
    console.error('Test script error:', err);
    process.exit(1);
  }
})();
