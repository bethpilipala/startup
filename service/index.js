const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('node:path');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;
const authCookieName = 'token';

// In-memory store until the database deliverable.
const users = [];

app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();
app.use('/api', apiRouter);
app.use(express.static('public'));

apiRouter.get('/health', (_req, res) => {
  res.send({ status: 'ok' });
});

apiRouter.post('/auth/create', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!validCredentials(email, password)) {
    return res.status(400).send({ msg: 'Enter an email and a password of at most 72 UTF-8 bytes.' });
  }
  if (findUser('email', email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  if (findUser('email', email)) {
    return res.status(409).send({ msg: 'Existing user' });
  }
  const user = createUser(email, passwordHash);
  setAuthCookie(res, user.token);
  res.send({ email: user.email });
});

apiRouter.post('/auth/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!validCredentials(email, password)) {
    return res.status(400).send({ msg: 'Enter an email and a password of at most 72 UTF-8 bytes.' });
  }
  const user = email ? findUser('email', email) : null;
  if (user && (await bcrypt.compare(password ?? '', user.password))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    return res.send({ email: user.email });
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', (req, res) => {
  const user = findUser('token', req.cookies[authCookieName]);
  if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Returns the current user; also serves as the simplest auth-protected endpoint.
apiRouter.get('/user/me', verifyAuth, (req, res) => {
  res.send({ email: req.user.email });
});

apiRouter.post('/data/import', verifyAuth, (req, res) => {
  const { ingredients, favorites, recent } = req.body ?? {};
  if (!isIngredientList(ingredients) || !isIdList(favorites) || !isIdList(recent)) {
    return res.status(400).send({ msg: 'Invalid imported data' });
  }
  const existingNames = new Set(req.user.ingredients.map((item) => item.name.trim().toLowerCase()));
  req.user.ingredients.push(...ingredients.filter((item) => {
    const name = item.name.trim().toLowerCase();
    if (existingNames.has(name)) return false;
    existingNames.add(name);
    return true;
  }));
  req.user.favorites = [...new Set([...req.user.favorites.map(String), ...favorites.map(String)])];
  req.user.recentlyViewed = [...new Set([...req.user.recentlyViewed.map(String), ...recent.map(String)])].slice(0, 5);
  res.send({ ingredients: req.user.ingredients, favorites: req.user.favorites, recent: req.user.recentlyViewed });
});

apiRouter.get('/ingredients', verifyAuth, (req, res) => {
  res.send(req.user.ingredients);
});

apiRouter.put('/ingredients', verifyAuth, (req, res) => {
  if (!isIngredientList(req.body)) {
    return res.status(400).send({ msg: 'Ingredients must be a valid list' });
  }
  req.user.ingredients = req.body;
  res.send(req.user.ingredients);
});

// Favorites and recently viewed are lists of recipe IDs.
apiRouter.get('/favorites', verifyAuth, (req, res) => {
  res.send(req.user.favorites);
});

apiRouter.put('/favorites', verifyAuth, (req, res) => {
  if (!isIdList(req.body)) {
    return res.status(400).send({ msg: 'Favorites must be a list of recipe IDs' });
  }
  req.user.favorites = req.body;
  res.send(req.user.favorites);
});

apiRouter.get('/recent', verifyAuth, (req, res) => {
  res.send(req.user.recentlyViewed);
});

apiRouter.put('/recent', verifyAuth, (req, res) => {
  if (!isIdList(req.body)) {
    return res.status(400).send({ msg: 'Recently viewed must be a list of recipe IDs' });
  }
  req.user.recentlyViewed = req.body;
  res.send(req.user.recentlyViewed);
});

apiRouter.use((_req, res) => {
  res.status(404).send({ msg: 'API endpoint not found' });
});

function isIdList(value) {
  return Array.isArray(value) && value.every((id) => typeof id === 'string' || typeof id === 'number');
}

function isIngredientList(value) {
  return Array.isArray(value) && value.every((item) =>
    item && typeof item.name === 'string' && item.name.trim()
    && typeof item.quantity === 'string' && item.quantity.trim()
    && ['shelf-stable', 'refrigerated'].includes(item.category)
    && (item.updatedAt === undefined || typeof item.updatedAt === 'string'));
}

function validCredentials(email, password) {
  return typeof email === 'string' && email.trim().length > 0
    && typeof password === 'string' && password.length > 0
    && Buffer.byteLength(password, 'utf8') <= 72;
}

function createUser(email, passwordHash) {
  const user = {
    email: normalizeEmail(email),
    password: passwordHash,
    token: uuid.v4(),
    ingredients: [],
    favorites: [],
    recentlyViewed: [],
  };
  users.push(user);
  return user;
}

function findUser(field, value) {
  if (!value) return null;
  const target = field === 'email' ? normalizeEmail(value) : value;
  return users.find((u) => u[field] === target) ?? null;
}

function normalizeEmail(email) {
  return String(email).trim().toLowerCase();
}

function verifyAuth(req, res, next) {
  const user = findUser('token', req.cookies[authCookieName]);
  if (!user) {
    return res.status(401).send({ msg: 'Unauthorized' });
  }
  req.user = user;
  next();
}

function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.use((req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method) || path.extname(req.path) || !req.accepts('html')) {
    return next();
  }
  res.sendFile('index.html', { root: 'public' });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

module.exports = app;
