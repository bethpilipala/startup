import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList.jsx";
import RecipeCard from "../components/recipes/RecipeCard.jsx";
import { recipes } from "../data/recipes.js";
import { APP_STORAGE_KEYS, getStorageItem } from "../services/storage.js";
import strings from "../strings/en.js";

const categories = [
  { name: "Breakfast", image: "/images/breakfast.jpg", imageAlt: "" },
  { name: "Lunch", image: "/images/lunch.jpg", imageAlt: "" },
  { name: "Dinner", image: "/images/dinner.jpg", imageAlt: "" },
  { name: "Appetizers", image: "/images/appetizers.jpg", imageAlt: "" },
  { name: "Sides", image: "/images/sides.jpg", imageAlt: "" },
  { name: "Soups & Salads", image: "/images/soups_and_salad.jpg", imageAlt: "" },
  { name: "Desserts", image: "/images/dessert.jpg", imageAlt: "" },
  { name: "Snacks & Drinks", image: "/images/snacks_and_drinks.jpg", imageAlt: "" },
];

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [recentlyViewedIds] = useState(() => {
    const storedIds = getStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes);
    return Array.isArray(storedIds) ? storedIds : [];
  });
  const activeCategory = searchParams.get("category") ?? "";
  const normalizedQuery = (searchParams.get("q") ?? "").trim().toLocaleLowerCase();
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = !activeCategory || recipe.categories?.some(
      (category) => category.toLocaleLowerCase() === activeCategory.toLocaleLowerCase(),
    );
    const searchableText = [
      recipe.title,
      recipe.description,
      ...(recipe.categories ?? []),
      ...(recipe.tags ?? []),
      ...(recipe.ingredients ?? []),
      ...(recipe.ingredientGroups ?? []).flatMap((group) => group.ingredients),
    ].join(" ").toLocaleLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });
  const recentlyViewedRecipes = recentlyViewedIds
    .map((recipeId) => recipes.find((recipe) => recipe.id === recipeId))
    .filter(Boolean);

  const handleSearch = (event) => {
    event.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (query.trim()) {
      nextParams.set("q", query.trim());
    } else {
      nextParams.delete("q");
    }
    setSearchParams(nextParams);
  };

  const clearFilters = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <main>
      <h1>{strings.recipes.pageTitle}</h1>
      <search>
        <form className="recipe-search-form" onSubmit={handleSearch}>
          <input className="form-control" type="search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={strings.recipes.searchPlaceholder} aria-label={strings.common.searchRecipesLabel} />
          <button className="btn" type="submit">{strings.common.searchButton}</button>
        </form>
      </search>
      <CategoryList categories={categories} />
      {recentlyViewedRecipes.length > 0 && (
        <section className="recipe-results" aria-labelledby="recently-viewed-heading">
          <h2 id="recently-viewed-heading">{strings.recipes.recentlyViewedHeading}</h2>
          <div className="recipe-results-grid">
            {recentlyViewedRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
      {(activeCategory || normalizedQuery) && (
        <section className="recipe-results" aria-live="polite">
          <div className="recipe-results-heading">
            <h2>{strings.recipes.resultsHeading}</h2>
            <button className="btn" type="button" onClick={clearFilters}>{strings.recipes.clearFiltersButton}</button>
          </div>
          {filteredRecipes.length > 0 ? (
            <div className="recipe-results-grid">
              {filteredRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
            </div>
          ) : <p>{strings.recipes.noResultsMessage}</p>}
        </section>
      )}
      <Link to="/random-recipe">{strings.recipes.randomRecipeLink}</Link>
    </main>
  );
}