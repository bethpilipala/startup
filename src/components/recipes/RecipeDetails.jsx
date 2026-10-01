import { Link } from "react-router-dom";
import IngredientsList from "./IngredientsList.jsx";
import InstructionsList from "./InstructionsList.jsx";
import RecipeHeader from "./RecipeHeader.jsx";
import RecipeTags from "./RecipeTags.jsx";
import strings from "../../strings/en.js";

export default function RecipeDetails({ recipe }) {
  return (
    <main>
      <article>
        <RecipeHeader {...recipe} />
        <figure className="recipe-detail-photo">
          <img src={recipe.image} alt={recipe.imageAlt} />
        </figure>
        <IngredientsList ingredients={recipe.ingredients} groups={recipe.ingredientGroups} />
        <InstructionsList instructions={recipe.instructions} />
        <RecipeTags tags={recipe.tags} />
        <section>
          <h2>{strings.recipes.haveIngredientsHeading}</h2>
          <p>{strings.recipes.haveIngredientsText}</p>
          <Link className="btn" to="/ingredients">{strings.common.updateIngredientsButton}</Link>
        </section>
        <section aria-labelledby="recipe-save-heading">
          <h2 id="recipe-save-heading">{strings.recipes.enjoyRecipeHeading}</h2>
          <p className="recipe-save-description">{strings.recipes.saveRecipeText}</p>
          <div className="recipe-save-actions">
            <button className="btn recipe-save-button" type="button">
              <span aria-hidden="true">♡</span> {strings.recipes.saveRecipeButton}
            </button>
            <output id="recipe-save-count" aria-live="polite">{strings.recipes.saveCountInitial}</output>
          </div>
        </section>
      </article>
    </main>
  );
}