const { test } = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('../index.js');

test('pantry data is protected, imported safely, and isolated between accounts', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const send = (path, method, body, cookie) => fetch(`${base}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const register = async (email) => {
    const response = await send('/auth/create', 'POST', { email, password: 'password' });
    assert.equal(response.status, 200);
    return response.headers.get('set-cookie').split(';')[0];
  };
  const ingredient = { name: 'Flour', quantity: '1 bag', category: 'shelf-stable', updatedAt: '2026-01-01' };

  try {
    assert.equal((await send('/ingredients', 'GET')).status, 401);
    const first = await register('pantry-first@example.test');
    const second = await register('pantry-second@example.test');
    assert.equal((await send('/ingredients', 'PUT', [{}], first)).status, 400);
    assert.equal((await send('/favorites', 'PUT', [{}], first)).status, 400);
    const imported = { ingredients: [ingredient], favorites: ['eggs-benedict'], recent: ['eggs-benedict'] };
    assert.equal((await send('/data/import', 'POST', imported, first)).status, 200);
    assert.equal((await send('/data/import', 'POST', imported, first)).status, 200);
    assert.deepEqual(await (await send('/ingredients', 'GET', undefined, first)).json(), [ingredient]);
    assert.deepEqual(await (await send('/favorites', 'GET', undefined, first)).json(), ['eggs-benedict']);
    assert.deepEqual(await (await send('/recent', 'GET', undefined, first)).json(), ['eggs-benedict']);
    for (const path of ['/ingredients', '/favorites', '/recent']) {
      assert.deepEqual(await (await send(path, 'GET', undefined, second)).json(), []);
    }
    assert.equal((await send('/ingredients', 'PUT', [], first)).status, 200);
    assert.deepEqual(await (await send('/ingredients', 'GET', undefined, first)).json(), []);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
