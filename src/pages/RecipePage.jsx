import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { recipes } from "../data/recipes.js";
import { getRecipe } from "../services/spoonacular.js";
import strings from "../strings/en.js";

export default function RecipePage({ user }) {
  const { recipeId } = useParams();
  const localRecipe = recipes.find((item) => item.id === recipeId);
  const isSpoonacularId = /^\d+$/.test(recipeId);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!isSpoonacularId) return;
    let active = true;
    getRecipe(recipeId).then(
      (recipe) => { if (active) setResult({ id: recipeId, recipe }); },
      (error) => { if (active) setResult({ id: recipeId, error: error.message }); },
    );
    return () => { active = false; };
  }, [recipeId, isSpoonacularId]);

  if (localRecipe) return <RecipeDetails key={recipeId} recipe={localRecipe} user={user} />;
  if (!isSpoonacularId) return <Navigate to="/recipes" replace />;
  if (result?.id !== recipeId) return <main><p role="status">{strings.recipes.loadingRecipes}</p></main>;
  if (result.error) return <main><p role="alert">{result.error}</p></main>;
  return <RecipeDetails key={recipeId} recipe={result.recipe} user={user} />;
}
