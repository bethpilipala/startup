import { Navigate, useParams } from "react-router-dom";
import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { recipes } from "../data/recipes.js";

export default function RecipePage() {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);

  return recipe ? <RecipeDetails recipe={recipe} /> : <Navigate to="/recipes" replace />;
}
