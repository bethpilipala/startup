import RecipeCard from "./RecipeCard.jsx";
import strings from "../../strings/en.js";

export default function RecipeList({ recipes = [] }) {
  return (
    <section aria-label={strings.recipes.recipesListLabel}>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.href || recipe.title}>
            <RecipeCard {...recipe} />
          </li>
        ))}
      </ul>
    </section>
  );
}