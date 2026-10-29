import { Navigate, useParams } from "react-router-dom";
import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { recipes } from "../data/recipes.js";

export default function RecipePage({ user }) {
  const { recipeId } = useParams();
  const recipe = recipes.find((item) => item.id === recipeId);

  return recipe ? <RecipeDetails recipe={recipe} user={user} /> : <Navigate to="/recipes" replace />;
}
