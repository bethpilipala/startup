export const APP_STORAGE_KEYS = {
  ingredients: "partialPantry.ingredients",
  favorites: "partialPantry.favorites",
  recentlyViewedRecipes: "partialPantry.recentlyViewedRecipes",
};

export function getUserFavoritesStorageKey(user) {
  if (!user?.email) {
    throw new TypeError("A signed-in user email is required to access favorites.");
  }

  return `${APP_STORAGE_KEYS.favorites}.${encodeURIComponent(user.email.trim().toLocaleLowerCase())}`;
}

export function getStorageItem(key) {
  const serializedValue = window.localStorage.getItem(key);
  return serializedValue === null ? null : JSON.parse(serializedValue);
}

export function setStorageItem(key, value) {
  const serializedValue = JSON.stringify(value);
  if (serializedValue === undefined) {
    throw new TypeError("Storage values must be JSON serializable.");
  }
  window.localStorage.setItem(key, serializedValue);
}
