import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import useRecipeOfTheDay from "../services/useRecipeOfTheDay.js";
import strings from "../strings/en.js";

export default function RecipeOfTheDay({ user }) {
  const { recipe, error, loading, retry } = useRecipeOfTheDay();

  if (recipe) return <RecipeDetails key={recipe.id} recipe={recipe} user={user} />;
  return (
    <main>
      <h1>{strings.home.recipeOfTheDayHeading}</h1>
      {loading && <p role="status">{strings.recipes.loadingRecipes}</p>}
      {error && (
        <>
          <p role="alert">{error}</p>
          <button className="btn" type="button" onClick={retry}>{strings.recipes.retryButton}</button>
        </>
      )}
    </main>
  );
}