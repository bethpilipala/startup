import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RecipeResultCard from "../components/recipes/RecipeResultCard.jsx";
import { searchRecipes } from "../services/spoonacular.js";
import strings from "../strings/en.js";

export default function RecipeResults() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const query = (searchParams.get("q") ?? "").trim();
  const requestKey = JSON.stringify([query, activeCategory]);
  const [result, setResult] = useState(null);
  const currentResult = result?.key === requestKey ? result : null;

  useEffect(() => {
    let active = true;
    searchRecipes({ query, category: activeCategory }).then(
      (recipes) => {
        if (active) setResult({ key: requestKey, recipes });
      },
      (error) => {
        if (active) setResult({ key: requestKey, error: error.message });
      },
    );
    return () => { active = false; };
  }, [query, activeCategory, requestKey]);

  const resultsHeading = activeCategory
    ? strings.recipes.categoryResultsHeading(activeCategory)
    : strings.recipes.resultsHeading;

  return (
    <main>
      <Link className="recipe-results-back" to="/recipes" aria-label={strings.recipes.backToCategoriesLabel}>
        <span aria-hidden="true">←</span> {strings.recipes.backToCategoriesLabel}
      </Link>
      <h1>{resultsHeading}</h1>
      {query && <p>{strings.recipes.searchResultsFor(query)}</p>}
      {!currentResult && <p role="status">{strings.recipes.loadingRecipes}</p>}
      {currentResult?.error && <p role="alert">{currentResult.error}</p>}
      {currentResult?.recipes?.length > 0 ? (
        <section aria-label={strings.recipes.recipesListLabel}>
          <div className="recipe-result-grid">
            {currentResult.recipes.map((recipe) => (
              <RecipeResultCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ) : currentResult?.recipes && (
        <p role="status">{strings.recipes.noResultsMessage}</p>
      )}
    </main>
  );
}
