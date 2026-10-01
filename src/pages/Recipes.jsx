import { Link } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList.jsx";
import strings from "../strings/en.js";
import appetizersImage from "../../images/appetizers.jpg";
import breakfastImage from "../../images/breakfast.jpg";
import dessertImage from "../../images/dessert.jpg";
import dinnerImage from "../../images/dinner.jpg";
import lunchImage from "../../images/lunch.jpg";
import sidesImage from "../../images/sides.jpg";
import snacksAndDrinksImage from "../../images/snacks_and_drinks.jpg";
import soupsAndSaladImage from "../../images/soups_and_salad.jpg";

const categories = [
  { name: "Breakfast", image: breakfastImage, imageAlt: "" },
  { name: "Lunch", image: lunchImage, imageAlt: "" },
  { name: "Dinner", image: dinnerImage, imageAlt: "" },
  { name: "Appetizers", image: appetizersImage, imageAlt: "" },
  { name: "Sides", image: sidesImage, imageAlt: "" },
  { name: "Soups & Salads", image: soupsAndSaladImage, imageAlt: "" },
  { name: "Desserts", image: dessertImage, imageAlt: "" },
  { name: "Snacks & Drinks", image: snacksAndDrinksImage, imageAlt: "" },
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