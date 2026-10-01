import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { pastaPrimaveraRecipe } from "../data/recipes.js";

export default function RandomRecipe() {
  return <RecipeDetails recipe={pastaPrimaveraRecipe} />;
}