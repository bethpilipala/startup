const BASE_URL = "https://api.spoonacular.com";
const CACHE_PREFIX = "partialPantry.spoonacular.";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const pendingRequests = new Map();
const categoryTypes = {
  Breakfast: "breakfast",
  Lunch: "main course",
  Dinner: "main course",
  Appetizers: "appetizer",
  Sides: "side dish",
  "Soups & Salads": "soup,salad",
  Desserts: "dessert",
  "Snacks & Drinks": "snack,beverage",
};

export class SpoonacularError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "SpoonacularError";
    this.status = status;
  }
}

function readCache(cacheKey) {
  try {
    const entry = JSON.parse(window.localStorage.getItem(cacheKey));
    if (entry && Date.now() - entry.savedAt < CACHE_TTL_MS) {
      return entry.data;
    }
  } catch {
    // A corrupt cache entry is treated as a miss.
  }
  return null;
}

function writeCache(cacheKey, data) {
  try {
    window.localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Caching is best effort; a full storage quota must not break the request.
  }
}

// Spoonacular charges points per request, so identical requests are cached.
// Pass { cache: false } for requests that must be fresh (e.g. random).
async function request(path, params = {}, { cache = true } = {}) {
  const apiKey = import.meta.env.VITE_SPOONACULAR_KEY;
  if (!apiKey) {
    throw new SpoonacularError("Missing VITE_SPOONACULAR_KEY. Add it to .env.local and restart the dev server.");
  }

  const query = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      query.set(name, value);
    }
  }

  // The key is left out of the cache key so it never ends up in storage.
  const cacheKey = `${CACHE_PREFIX}${path}?${query}`;
  if (cache) {
    const cached = readCache(cacheKey);
    if (cached) return cached;
  }

  if (cache && pendingRequests.has(cacheKey)) return pendingRequests.get(cacheKey);

  query.set("apiKey", apiKey);
  const pending = fetchResponse(path, query, cache ? cacheKey : null);
  if (cache) pendingRequests.set(cacheKey, pending);
  try {
    return await pending;
  } finally {
    if (cache) pendingRequests.delete(cacheKey);
  }
}

async function fetchResponse(path, query, cacheKey) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`);
  } catch {
    throw new SpoonacularError("Could not reach Spoonacular. Check your connection.");
  }

  if (response.status === 402) {
    throw new SpoonacularError("The Spoonacular quota has been used up. Try again later.", response.status);
  }
  if (response.status === 429) {
    throw new SpoonacularError("Too many Spoonacular requests. Please try again later.", response.status);
  }
  if (response.status === 401) {
    throw new SpoonacularError("Spoonacular rejected the API key.", response.status);
  }
  if (!response.ok) {
    throw new SpoonacularError(`Spoonacular request failed (${response.status}).`, response.status);
  }

  const data = await response.json();
  if (cacheKey) writeCache(cacheKey, data);
  return data;
}

function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function formatMinutes(minutes) {
  // Spoonacular uses -1 or null when a time is unknown.
  if (!Number.isFinite(minutes) || minutes <= 0) return "";
  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getInstructions(recipe) {
  const steps = (recipe.analyzedInstructions ?? []).flatMap((group) => group.steps ?? []);
  if (steps.length > 0) {
    return steps.map((step) => step.step);
  }
  return stripHtml(recipe.instructions)
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

// Converts a Spoonacular recipe into the shape the app's components already use.
export function mapRecipe(recipe) {
  const id = String(recipe.id);
  const ingredients = (recipe.extendedIngredients ?? []).map((ingredient) => ingredient.original);

  return {
    id,
    path: `/recipes/${id}`,
    categories: (recipe.dishTypes ?? []).map(capitalize),
    title: recipe.title,
    description: stripHtml(recipe.summary),
    image: recipe.image,
    imageAlt: recipe.title,
    prepTime: formatMinutes(recipe.preparationMinutes),
    cookTime: formatMinutes(recipe.cookingMinutes),
    totalTime: formatMinutes(recipe.readyInMinutes),
    servings: recipe.servings ? String(recipe.servings) : "",
    ingredientGroups: ingredients.length > 0 ? [{ name: "Ingredients", ingredients }] : [],
    instructions: getInstructions(recipe),
    tags: [...(recipe.diets ?? []), ...(recipe.cuisines ?? [])].map(capitalize),
  };
}

export async function searchRecipes({ query, category, number = 12 } = {}) {
  if (category && !Object.hasOwn(categoryTypes, category)) {
    throw new SpoonacularError("This recipe category is not supported.");
  }
  const data = await request("/recipes/complexSearch", {
    query,
    type: category ? categoryTypes[category] : undefined,
    number,
  });
  return data.results.map(mapRecipe);
}

export async function getRecipe(id) {
  const data = await request(`/recipes/${encodeURIComponent(id)}/information`);
  return mapRecipe(data);
}

export async function getRandomRecipe() {
  const data = await request("/recipes/random", { number: 1 }, { cache: false });
  if (!Array.isArray(data.recipes) || data.recipes.length === 0) {
    throw new SpoonacularError("Spoonacular did not return a random recipe. Please try again.");
  }
  return mapRecipe(data.recipes[0]);
}

// Recipe of the day is the same all day, so it is cached under a per-date key.
export async function getRecipeOfTheDay(date = new Date()) {
  const day = date.toISOString().slice(0, 10);
  const cacheKey = `${CACHE_PREFIX}recipeOfTheDay.${day}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const recipe = await getRandomRecipe();
  writeCache(cacheKey, recipe);
  return recipe;
}
