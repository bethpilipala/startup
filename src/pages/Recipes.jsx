import { Link } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList.jsx";
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
  return (
    <main>
      <h1>{strings.recipes.pageTitle}</h1>
      <search>
        <form className="recipe-search-form" action="/search" method="get">
          <input className="form-control" type="search" name="q" placeholder={strings.recipes.searchPlaceholder} aria-label={strings.common.searchRecipesLabel} />
          <button className="btn" type="submit">{strings.common.searchButton}</button>
        </form>
      </search>
      <CategoryList categories={categories} />
      <Link to="/random-recipe">{strings.recipes.randomRecipeLink}</Link>
    </main>
  );
}