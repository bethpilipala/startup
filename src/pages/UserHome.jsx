import { Link } from "react-router-dom";
import RecipeResultCard from "../components/recipes/RecipeResultCard.jsx";
import useSavedRecipes from "../services/useSavedRecipes.js";
import { usePantry } from "../services/pantryContext.js";
import strings from "../strings/en.js";

export default function UserHome({ user }) {
  const { ingredients: pantryIngredients, favorites: favoriteIds, status, error, retry } = usePantry();
  const { recipes: favoriteRecipes, errors, loading } = useSavedRecipes(favoriteIds);

  return (
    <main className="userhome">
      <h1>{strings.userhome.title}</h1>
      {status === "loading" && <p role="status">{strings.pantry.loading}</p>}
      {error && <p role="alert">{error}</p>}
      {status === "error" && <button className="btn" type="button" onClick={retry}>{strings.recipes.retryButton}</button>}
      {status === "ready" && <>
      <p className="userhome-greeting">{strings.userhome.greeting(user?.name ?? user?.email ?? "")}</p>
      <p className="userhome-pantry-count">
        {strings.userhome.pantryCount(pantryIngredients.length)}
      </p>
      <div className="row g-4 userhome-overview">
        <div className="col-lg-7">
          <section className="userhome-recipes" aria-labelledby="your-recipes-heading">
            <h2 id="your-recipes-heading">{strings.userhome.myRecipesHeading}</h2>
            {loading && <p role="status">{strings.recipes.loadingRecipes}</p>}
            {errors.length > 0 && <p role="alert">{strings.recipes.savedRecipesError} {errors[0]}</p>}
            {favoriteRecipes.length > 0 ? (
              <div className="userhome-favorites-grid">
                {favoriteRecipes.map((recipe) => (
                  <RecipeResultCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : !loading && errors.length === 0 && (
              <div className="userhome-empty-state" role="status">
                <p>{strings.userhome.noRecipesSavedText}</p>
                <p>{strings.userhome.recipesWillAppearText}</p>
                <Link to="/recipes">{strings.userhome.exploreRecipesLink}</Link>
              </div>
            )}
          </section>
        </div>
        <div className="col-lg-5">
          <section className="userhome-ingredients" aria-labelledby="your-ingredients-heading">
            <div className="userhome-section-heading">
              <h2 id="your-ingredients-heading">{strings.userhome.myIngredientsHeading}</h2>
              <Link to="/ingredients">{strings.userhome.viewAllLink}</Link>
            </div>
            <ul className="list-group list-group-flush userhome-ingredient-list">
              {pantryIngredients.map((ingredient) => (
                <li className="list-group-item d-flex justify-content-between" key={ingredient.name}>
                  <span>{ingredient.name}</span><span>{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
            <Link className="btn" to="/ingredients">{strings.common.updateIngredientsButton}</Link>
          </section>
        </div>
      </div>
      </>}
    </main>
  );
}