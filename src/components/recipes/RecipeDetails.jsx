import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import IngredientsList from "./IngredientsList.jsx";
import InstructionsList from "./InstructionsList.jsx";
import RecipeHeader from "./RecipeHeader.jsx";
import RecipeTags from "./RecipeTags.jsx";
import {
  APP_STORAGE_KEYS,
  getStorageItem,
  getUserFavoritesStorageKey,
  setStorageItem,
} from "../../services/storage.js";
import strings from "../../strings/en.js";

const measurementWords = new Set([
  "cup", "cups", "tablespoon", "tablespoons", "teaspoon", "teaspoons", "ounce",
  "ounces", "oz", "pound", "pounds", "lb", "lbs", "gram", "grams", "g", "kg",
  "clove", "cloves", "slice", "slices", "piece", "pieces", "large", "medium", "small",
  "fresh", "dried", "chopped", "minced", "melted", "optional", "to", "taste",
  "for", "garnish", "split", "unsalted", "salted",
]);

function normalizeIngredient(value) {
  return value
    .replace(/\([^)]*\)/g, " ")
    .replace(/^\s*(?:\d+\s*\/\s*\d+|\d+(?:\.\d+)?|\.\d+)\s*/, "")
    .toLocaleLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !measurementWords.has(word))
    .map((word) => (word.endsWith("s") && word.length > 3 ? word.slice(0, -1) : word))
    .join(" ");
}

function getRecipeIngredients(recipe) {
  return recipe.ingredients ?? recipe.ingredientGroups.flatMap((group) => group.ingredients);
}

function pantryContainsIngredient(pantry, recipeIngredient) {
  const recipeWords = normalizeIngredient(recipeIngredient).split(" ").filter(Boolean);
  return pantry.some((item) => {
    const pantryWords = normalizeIngredient(item.name).split(" ").filter(Boolean);
    const commonWords = recipeWords.filter((word) => pantryWords.includes(word));
    return commonWords.length > 0
      && (commonWords.length === recipeWords.length || commonWords.length === pantryWords.length);
  });
}

export default function RecipeDetails({ recipe, user }) {
  const [pantry, setPantry] = useState(() => getStorageItem(APP_STORAGE_KEYS.ingredients) ?? []);
  const [showMadeForm, setShowMadeForm] = useState(false);
  const [usedUpNames, setUsedUpNames] = useState([]);
  const [madeMessage, setMadeMessage] = useState("");
  const favoriteStorageKey = user ? getUserFavoritesStorageKey(user) : null;
  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (!favoriteStorageKey) {
      return [];
    }

    const storedFavorites = getStorageItem(favoriteStorageKey);
    return Array.isArray(storedFavorites) ? storedFavorites : [];
  });
  const isFavorite = favoriteIds.includes(recipe.id);
  const ingredientCheck = useMemo(() => {
    const recipeIngredients = getRecipeIngredients(recipe);
    const matchedPantryItems = pantry.filter((item) => recipeIngredients.some(
      (ingredient) => pantryContainsIngredient([item], ingredient),
    ));
    const missing = recipeIngredients.filter(
      (ingredient) => !pantryContainsIngredient(pantry, ingredient),
    );
    return {
      total: recipeIngredients.length,
      missing,
      available: recipeIngredients.length - missing.length,
      matchedPantryItems,
    };
  }, [pantry, recipe]);

  useEffect(() => {
    const storedRecipeIds = getStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes);
    const previousRecipeIds = Array.isArray(storedRecipeIds) ? storedRecipeIds : [];
    const nextRecipeIds = [
      recipe.id,
      ...previousRecipeIds.filter((recipeId) => recipeId !== recipe.id),
    ].slice(0, 5);

    setStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes, nextRecipeIds);
  }, [recipe.id]);

  const toggleFavorite = () => {
    if (!favoriteStorageKey) {
      return;
    }

    const nextFavoriteIds = isFavorite
      ? favoriteIds.filter((id) => id !== recipe.id)
      : [...favoriteIds, recipe.id];
    setStorageItem(favoriteStorageKey, nextFavoriteIds);
    setFavoriteIds(nextFavoriteIds);
  };

  const openMadeForm = () => {
    setUsedUpNames([]);
    setMadeMessage("");
    setShowMadeForm(true);
  };

  const toggleUsedUpIngredient = (ingredientName) => {
    setUsedUpNames((currentNames) => currentNames.includes(ingredientName)
      ? currentNames.filter((name) => name !== ingredientName)
      : [...currentNames, ingredientName]);
  };

  const handleMarkAsMade = (event) => {
    event.preventDefault();
    const nextPantry = pantry.filter((ingredient) => !usedUpNames.includes(ingredient.name));
    setStorageItem(APP_STORAGE_KEYS.ingredients, nextPantry);
    setPantry(nextPantry);
    setShowMadeForm(false);
    setMadeMessage(strings.recipes.markedAsMadeMessage(
      recipe.title,
      usedUpNames.length,
    ));
  };

  return (
    <main>
      <article>
        <RecipeHeader {...recipe} />
        <figure className="recipe-detail-photo">
          <img src={recipe.image} alt={recipe.imageAlt} />
        </figure>
        <IngredientsList ingredients={recipe.ingredients} groups={recipe.ingredientGroups} />
        <InstructionsList instructions={recipe.instructions} />
        <RecipeTags tags={recipe.tags} />
        <section>
          <h2>{strings.recipes.haveIngredientsHeading}</h2>
          {pantry.length === 0 ? (
            <p>{strings.recipes.emptyPantryMessage}</p>
          ) : (
            <>
              <p>
                {strings.recipes.matchCount(ingredientCheck.available, ingredientCheck.total)}
              </p>
              {ingredientCheck.missing.length > 0 && (
                <>
                  <h3>{strings.recipes.missingIngredientsHeading}</h3>
                  <ul>
                    {ingredientCheck.missing.map((ingredient, index) => (
                      <li key={`${ingredient}-${index}`}>{ingredient}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
          <Link className="btn" to="/ingredients">{strings.common.updateIngredientsButton}</Link>
        </section>
        <section aria-labelledby="mark-as-made-heading">
          <h2 id="mark-as-made-heading">{strings.recipes.markAsMadeHeading}</h2>
          <p>{strings.recipes.markAsMadeDescription}</p>
          {!showMadeForm ? (
            <button className="btn" type="button" onClick={openMadeForm}>
              {strings.recipes.markAsMadeButton}
            </button>
          ) : (
            <form className="used-ingredients-form" onSubmit={handleMarkAsMade}>
              <fieldset>
                <legend>{strings.recipes.usedUpIngredientsPrompt}</legend>
                {ingredientCheck.matchedPantryItems.length > 0 ? (
                  ingredientCheck.matchedPantryItems.map((ingredient) => (
                    <label className="used-ingredient-option" key={ingredient.name}>
                      <input
                        type="checkbox"
                        checked={usedUpNames.includes(ingredient.name)}
                        onChange={() => toggleUsedUpIngredient(ingredient.name)}
                      />
                      <span>{ingredient.name} ({ingredient.quantity})</span>
                    </label>
                  ))
                ) : <p>{strings.recipes.noMatchedPantryIngredients}</p>}
              </fieldset>
              <div className="recipe-save-actions">
                <button className="btn" type="submit">{strings.recipes.confirmMadeButton}</button>
                <button className="btn" type="button" onClick={() => setShowMadeForm(false)}>
                  {strings.recipes.cancelMadeButton}
                </button>
              </div>
            </form>
          )}
          {madeMessage && <p role="status">{madeMessage}</p>}
        </section>
        <section aria-labelledby="recipe-save-heading">
          <h2 id="recipe-save-heading">{strings.recipes.enjoyRecipeHeading}</h2>
          <p className="recipe-save-description">{strings.recipes.saveRecipeText}</p>
          <div className="recipe-save-actions">
            {user ? (
              <button
                className="btn recipe-save-button"
                type="button"
                aria-pressed={isFavorite}
                onClick={toggleFavorite}
              >
                <span aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>&ensp;
                {isFavorite ? strings.recipes.removeFavoriteButton : strings.recipes.saveRecipeButton}
              </button>
            ) : (
              <Link className="btn recipe-save-button" to="/login">
                {strings.recipes.signInToSaveLink}
              </Link>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}