import RecipeCard from "../components/recipes/RecipeCard.jsx";
import ActivityFeed from "../components/activity/ActivityFeed.jsx";
import strings from "../strings/en.js";
import useRecipeOfTheDay from "../services/useRecipeOfTheDay.js";

export default function Home() {
  const { recipe, error, loading, retry } = useRecipeOfTheDay();

  return (
    <main>
      <h1 className="home-page-title">{strings.common.siteName}</h1>
      <p className="home-intro">
        {strings.home.intro}
      </p>
      <section className="recipe-of-the-day" aria-labelledby="recipe-of-the-day-heading">
        <h2 id="recipe-of-the-day-heading">{strings.home.recipeOfTheDayHeading}</h2>
        {loading && <p role="status">{strings.recipes.loadingRecipes}</p>}
        {error && (
          <>
            <p role="alert">{error}</p>
            <button className="btn" type="button" onClick={retry}>{strings.recipes.retryButton}</button>
          </>
        )}
        {recipe && (
          <RecipeCard
            className="recipe-of-the-day-link"
            recipe={{ ...recipe, path: "/recipe-of-the-day" }}
            imageAlt=""
          />
        )}
      </section>
      <ActivityFeed />
    </main>
  );
}