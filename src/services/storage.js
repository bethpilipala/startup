import { eggsBenedictRecipe, pastaPrimaveraRecipe } from "../data/recipes.js";

export const APP_STORAGE_KEYS = {
  ingredients: "partialPantry.ingredients",
  recipes: "partialPantry.recipes",
};

const initialIngredients = [
  { name: "Flour", quantity: "10 lbs", category: "shelf-stable" },
  { name: "Sugar", quantity: "5 lbs", category: "shelf-stable" },
  { name: "Rice", quantity: "2 lbs", category: "shelf-stable" },
  { name: "Pasta, Fettuccine", quantity: "1 box", category: "shelf-stable" },
  { name: "Eggs", quantity: "1 dozen", category: "refrigerated" },
  { name: "Milk", quantity: "1 gallon", category: "refrigerated" },
  { name: "Cheese, Pepper Jack", quantity: "1 lb", category: "refrigerated" },
  { name: "Butter, salted", quantity: "4 sticks", category: "refrigerated" },
];

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

export function removeStorageItem(key) {
  window.localStorage.removeItem(key);
}

export function initializeAppData() {
  const today = new Date().toISOString().slice(0, 10);
  const ingredients = initialIngredients.map((ingredient) => ({
    ...ingredient,
    updatedAt: today,
  }));
  const initialData = [
    [APP_STORAGE_KEYS.ingredients, ingredients],
    [APP_STORAGE_KEYS.recipes, [eggsBenedictRecipe, pastaPrimaveraRecipe]],
  ];

  for (const [key, value] of initialData) {
    if (window.localStorage.getItem(key) === null) {
      setStorageItem(key, value);
    }
  }
}
