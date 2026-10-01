import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { eggsBenedictRecipe } from "../data/recipes.js";

export default function RecipeOfTheDay() {
  return <RecipeDetails recipe={eggsBenedictRecipe} />;
}