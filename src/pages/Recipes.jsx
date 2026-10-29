import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList.jsx";
import RecipeResultCard from "../components/recipes/RecipeResultCard.jsx";
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
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [recentlyViewedIds] = useState(() => {
    const storedIds = getStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes);
    return Array.isArray(storedIds) ? storedIds : [];
  });
  const recentlyViewedRecipes = recentlyViewedIds
    .map((recipeId) => recipes.find((recipe) => recipe.id === recipeId))
    .filter(Boolean);

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(`/recipes/results${trimmedQuery ? `?q=${encodeURIComponent(trimmedQuery)}` : ""}`);
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
      <Link to="/random-recipe">{strings.recipes.randomRecipeLink}</Link>
      {recentlyViewedRecipes.length > 0 && (
        <section className="recently-viewed-banner" aria-labelledby="recently-viewed-heading">
          <h2 id="recently-viewed-heading">{strings.recipes.recentlyViewedHeading}</h2>
          <div className="recently-viewed-list">
            {recentlyViewedRecipes.map((recipe) => (
              <RecipeResultCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}