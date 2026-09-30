import RecipeCard from "./RecipeCard.jsx";

export default function RecipeList({ recipes = [] }) {
  return (
    <section aria-label="Recipes">
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