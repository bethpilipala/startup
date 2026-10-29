import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { getRecipeOfTheDay } from "../data/recipes.js";

export default function RecipeOfTheDay() {
  return <RecipeDetails recipe={getRecipeOfTheDay()} />;
}