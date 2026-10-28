import { useState } from "react";
import { Link } from "react-router-dom";
import { APP_STORAGE_KEYS, getStorageItem } from "../services/storage.js";
import strings from "../strings/en.js";

export default function UserHome() {
  const [pantryIngredients] = useState(
    () => getStorageItem(APP_STORAGE_KEYS.ingredients) ?? [],
  );

  return (
    <main className="userhome">
      <h1>{strings.userhome.title}</h1>
      <div className="row g-4 userhome-overview">
        <div className="col-lg-7">
          <section className="userhome-recipes" aria-labelledby="your-recipes-heading">
            <h2 id="your-recipes-heading">{strings.userhome.myRecipesHeading}</h2>
            <div className="row row-cols-1 row-cols-md-2 g-3 userhome-recipe-grid">
              <div className="col">
                <div className="userhome-empty-state" role="status">
                  <p>{strings.userhome.noRecipesSavedText}</p>
                  <p>{strings.userhome.recipesWillAppearText}</p>
                  <Link to="/recipes">{strings.userhome.exploreRecipesLink}</Link>
                </div>
              </div>
            </div>
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
    </main>
  );
}