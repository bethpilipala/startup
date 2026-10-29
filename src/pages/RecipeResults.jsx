import { Link, useSearchParams } from "react-router-dom";
import RecipeResultCard from "../components/recipes/RecipeResultCard.jsx";
import { recipes } from "../data/recipes.js";
import strings from "../strings/en.js";

function matchesSearch(recipe, query) {
  if (!query) {
    return true;
  }

  const searchableText = [
    recipe.title,
    recipe.description,
    ...(recipe.categories ?? []),
    ...(recipe.tags ?? []),
    ...(recipe.ingredients ?? []),
    ...(recipe.ingredientGroups ?? []).flatMap((group) => group.ingredients),
  ].join(" ").toLocaleLowerCase();

  return searchableText.includes(query);
}

export default function RecipeResults() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const normalizedQuery = (searchParams.get("q") ?? "").trim().toLocaleLowerCase();
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = !activeCategory || recipe.categories?.some(
      (category) => category.toLocaleLowerCase() === activeCategory.toLocaleLowerCase(),
    );
    return matchesCategory && matchesSearch(recipe, normalizedQuery);
  });
  const resultsHeading = activeCategory
    ? strings.recipes.categoryResultsHeading(activeCategory)
    : strings.recipes.resultsHeading;

  return (
    <main>
      <Link className="recipe-results-back" to="/recipes" aria-label={strings.recipes.backToCategoriesLabel}>
        <span aria-hidden="true">←</span> {strings.recipes.backToCategoriesLabel}
      </Link>
      <h1>{resultsHeading}</h1>
      {normalizedQuery && <p>{strings.recipes.searchResultsFor(normalizedQuery)}</p>}
      {filteredRecipes.length > 0 ? (
        <section aria-label={strings.recipes.recipesListLabel}>
          <div className="recipe-result-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeResultCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      ) : (
        <p role="status">{strings.recipes.noResultsMessage}</p>
      )}
    </main>
  );
}
