import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import IngredientsList from "./IngredientsList.jsx";
import InstructionsList from "./InstructionsList.jsx";
import RecipeHeader from "./RecipeHeader.jsx";
import RecipeTags from "./RecipeTags.jsx";
import { usePantry } from "../../services/pantryContext.js";
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
  const navigate = useNavigate();
  const { ingredients: pantry, favorites: favoriteIds, recent, status, error, saving, update, retry } = usePantry();
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockPending, setWakeLockPending] = useState(false);
  const [wakeLockMessage, setWakeLockMessage] = useState("");
  const [showMadeForm, setShowMadeForm] = useState(false);
  const [usedUpNames, setUsedUpNames] = useState([]);
  const [madeMessage, setMadeMessage] = useState("");
  const recordedRecipeRef = useRef(null);
  const wakeLockRef = useRef(null);
  const wakeLockReleaseHandlerRef = useRef(null);
  const isFavorite = favoriteIds.some((id) => String(id) === String(recipe.id));
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
    if (status !== "ready" || saving || recordedRecipeRef.current === recipe.id) return;
    recordedRecipeRef.current = recipe.id;
    if (String(recent[0]) !== String(recipe.id)) {
      update("recent", (ids) => [recipe.id, ...ids.filter((id) => String(id) !== String(recipe.id))].slice(0, 5));
    }
  }, [recipe.id, status, saving, recent, update]);

  useEffect(() => () => {
    const wakeLock = wakeLockRef.current;
    if (wakeLock) {
      if (wakeLockReleaseHandlerRef.current) {
        wakeLock.removeEventListener("release", wakeLockReleaseHandlerRef.current);
      }
      wakeLock.release().catch((error) => {
        console.error(strings.recipes.wakeLockReleaseError, error);
      });
    }
  }, []);

  const toggleFavorite = () => {
    update("favorites", (ids) => isFavorite
      ? ids.filter((id) => String(id) !== String(recipe.id))
      : [...ids, recipe.id]);
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

  const handleMarkAsMade = async (event) => {
    event.preventDefault();
    const saved = await update("ingredients", (items) => items.filter((ingredient) => !usedUpNames.includes(ingredient.name)));
    if (!saved) return;
    setShowMadeForm(false);
    setMadeMessage(strings.recipes.markedAsMadeMessage(
      recipe.title,
      usedUpNames.length,
    ));
  };

  const handleWakeLockToggle = async () => {
    setWakeLockMessage("");

    if (wakeLockRef.current) {
      const currentWakeLock = wakeLockRef.current;
      wakeLockRef.current = null;
      if (wakeLockReleaseHandlerRef.current) {
        currentWakeLock.removeEventListener("release", wakeLockReleaseHandlerRef.current);
        wakeLockReleaseHandlerRef.current = null;
      }
      try {
        await currentWakeLock.release();
        setWakeLockActive(false);
      } catch {
        wakeLockRef.current = currentWakeLock;
        setWakeLockActive(true);
        setWakeLockMessage(strings.recipes.wakeLockReleaseError);
      }
      return;
    }

    if (!("wakeLock" in navigator)) {
      setWakeLockMessage(strings.recipes.wakeLockUnsupported);
      return;
    }

    setWakeLockPending(true);
    try {
      const wakeLock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = wakeLock;
      const handleRelease = () => {
        wakeLockRef.current = null;
        wakeLockReleaseHandlerRef.current = null;
        setWakeLockActive(false);
      };
      wakeLockReleaseHandlerRef.current = handleRelease;
      wakeLock.addEventListener("release", handleRelease, { once: true });
      setWakeLockActive(true);
    } catch {
      setWakeLockMessage(strings.recipes.wakeLockRequestError);
    } finally {
      setWakeLockPending(false);
    }
  };

  const recipeServings = Number.parseFloat(recipe.servings);
  const scaledServings = Number.isFinite(recipeServings)
    ? String(Number((recipeServings * servingMultiplier).toFixed(2)))
    : recipe.servings;

  return (
    <main>
      <button className="recipe-results-back" type="button" onClick={() => navigate(-1)}>
        <span aria-hidden="true">←</span> Back
      </button>
      <article>
        {status === "loading" && <p role="status">{strings.pantry.loading}</p>}
        {error && <p role="alert">{error}</p>}
        {status === "error" && <button className="btn" type="button" onClick={retry}>{strings.recipes.retryButton}</button>}
        {saving && <p role="status">{strings.pantry.saving}</p>}
        <RecipeHeader {...recipe} servings={scaledServings} />
        {recipe.image && (
          <figure className="recipe-detail-photo">
            <img src={recipe.image} alt={recipe.imageAlt} />
          </figure>
        )}
        <section className="recipe-scaling" aria-labelledby="recipe-scaling-heading">
          <h2 id="recipe-scaling-heading">{strings.recipes.scaleRecipeHeading}</h2>
          <div className="recipe-save-actions" role="group" aria-label={strings.recipes.scaleRecipeLabel}>
            {[0.5, 1, 2].map((multiplier) => (
              <button
                className="btn"
                key={multiplier}
                type="button"
                aria-pressed={servingMultiplier === multiplier}
                onClick={() => setServingMultiplier(multiplier)}
              >
                {strings.recipes.scaleRecipeOption(multiplier)}
              </button>
            ))}
          </div>
        </section>
        <IngredientsList
          ingredients={recipe.ingredients}
          groups={recipe.ingredientGroups}
          multiplier={servingMultiplier}
        />
        <InstructionsList instructions={recipe.instructions} />
        <RecipeTags tags={recipe.tags} />
        <section aria-labelledby="wake-lock-heading">
          <h2 id="wake-lock-heading">{strings.recipes.wakeLockHeading}</h2>
          <p>{strings.recipes.wakeLockDescription}</p>
          <button
            className="btn"
            type="button"
            onClick={handleWakeLockToggle}
            disabled={wakeLockPending}
            aria-pressed={wakeLockActive}
          >
            {wakeLockActive ? strings.recipes.disableWakeLockButton : strings.recipes.enableWakeLockButton}
          </button>
          {wakeLockMessage && <p role="status">{wakeLockMessage}</p>}
        </section>
        <section>
          <h2>{strings.recipes.haveIngredientsHeading}</h2>
          {!user ? (
            <p>{strings.pantry.guestPantry}</p>
          ) : status !== "ready" ? (
            <p>{strings.pantry.loading}</p>
          ) : ingredientCheck.total === 0 ? (
            <p>{strings.recipes.notProvided}</p>
          ) : pantry.length === 0 ? (
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
        {user && status === "ready" && <section aria-labelledby="mark-as-made-heading">
          <h2 id="mark-as-made-heading">{strings.recipes.markAsMadeHeading}</h2>
          <p>{strings.recipes.markAsMadeDescription}</p>
          {!showMadeForm ? (
            <button className="btn" type="button" onClick={openMadeForm} disabled={saving}>
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
                <button className="btn" type="submit" disabled={saving}>{strings.recipes.confirmMadeButton}</button>
                <button className="btn" type="button" onClick={() => setShowMadeForm(false)}>
                  {strings.recipes.cancelMadeButton}
                </button>
              </div>
            </form>
          )}
          {madeMessage && <p role="status">{madeMessage}</p>}
        </section>}
        <section aria-labelledby="recipe-save-heading">
          <h2 id="recipe-save-heading">{strings.recipes.enjoyRecipeHeading}</h2>
          <p className="recipe-save-description">{strings.recipes.saveRecipeText}</p>
          <div className="recipe-save-actions">
            {user ? (
              <button
                className="btn recipe-save-button"
                type="button"
                disabled={status !== "ready" || saving}
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