import { recipes } from "../data/recipes.js";
import { getRandomRecipe } from "./spoonacular.js";

const storageKey = "partialPantry.recipeOfTheDay";
const pendingSelections = new Map();

export function getLocalDay(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getRecipeOfTheDay(date = new Date()) {
  const day = getLocalDay(date);
  let saved;
  try {
    const stored = window.localStorage.getItem(storageKey);
    saved = stored ? JSON.parse(stored) : null;
  } catch (error) {
    return Promise.reject(new Error("Could not read the saved recipe of the day.", { cause: error }));
  }
  if (saved?.day === day && saved.recipe?.id && saved.recipe?.title) {
    return Promise.resolve(saved.recipe);
  }
  if (pendingSelections.has(day)) return pendingSelections.get(day);

  const dayNumber = Math.floor(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate(),
  ) / 86400000);
  const selection = (dayNumber % 2 === 0
    ? Promise.resolve(recipes[((dayNumber / 2) % recipes.length + recipes.length) % recipes.length])
    : getRandomRecipe()
  ).then((recipe) => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ day, recipe }));
    } catch (error) {
      throw new Error("Could not save the recipe of the day. Check browser storage and try again.", { cause: error });
    }
    return recipe;
  }).finally(() => pendingSelections.delete(day));

  pendingSelections.set(day, selection);
  return selection;
}
