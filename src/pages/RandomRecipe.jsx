import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { pastaPrimaveraRecipe } from "../data/recipes.js";

export default function RecipeExample() {
  return <RecipeDetails recipe={pastaPrimaveraRecipe} />;
}