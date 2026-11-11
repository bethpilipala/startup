const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('../index.js');

test('registration, authentication, sessions, and logout', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const request = (path, options = {}) => fetch(`${base}${path}`, options);
  const credentials = (email, password) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const cookie = (response) => response.headers.get('set-cookie').split(';')[0];

  try {
    assert.equal((await request('/user/me')).status, 401);
    const invalid = await request('/auth/create', credentials(' ', 'password'));
    assert.equal(invalid.status, 400);
    assert.equal((await request('/auth/create', credentials('a@example.test', 'a'.repeat(73)))).status, 400);

    const registrations = await Promise.all([
      request('/auth/create', credentials('Test@example.test', 'password')),
      request('/auth/create', credentials('test@example.test', 'password')),
    ]);
    assert.deepEqual(registrations.map((response) => response.status).sort(), [200, 409]);
    const created = registrations.find((response) => response.ok);
    const firstCookie = cookie(created);
    assert.match(created.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(created.headers.get('set-cookie'), /Secure/i);
    assert.equal((await created.json()).email, 'test@example.test');
    assert.equal((await request('/auth/login', credentials('test@example.test', 'wrong'))).status, 401);
    assert.equal((await request('/user/me', { headers: { Cookie: firstCookie } })).status, 200);

    const loggedIn = await request('/auth/login', credentials('TEST@example.test', 'password'));
    assert.equal(loggedIn.status, 200);
    const loginCookie = cookie(loggedIn);
    assert.notEqual(loginCookie, firstCookie);
    assert.equal((await request('/user/me', { headers: { Cookie: firstCookie } })).status, 401);
    const me = await request('/user/me', { headers: { Cookie: loginCookie } });
    assert.deepEqual(await me.json(), { email: 'test@example.test' });

    const loggedOut = await request('/auth/logout', { method: 'DELETE', headers: { Cookie: loginCookie } });
    assert.equal(loggedOut.status, 204);
    assert.equal((await request('/user/me', { headers: { Cookie: loginCookie } })).status, 401);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
