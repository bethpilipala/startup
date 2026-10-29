import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { getRecipeOfTheDay } from "../data/recipes.js";

export default function RecipeOfTheDay({ user }) {
  return <RecipeDetails recipe={getRecipeOfTheDay()} user={user} />;
}