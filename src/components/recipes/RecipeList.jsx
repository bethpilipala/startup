import RecipeCard from "./RecipeCard.jsx";
import strings from "../../strings/en.js";

export default function RecipeList({ recipes = [] }) {
  return (
    <section aria-label={strings.recipes.recipesListLabel}>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </section>
  );
}