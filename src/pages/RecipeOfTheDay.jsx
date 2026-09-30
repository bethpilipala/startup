import { Link } from "react-router-dom";
import eggsBenedictImage from "../../images/eggs_benedict.jpg";
import IngredientsList from "../components/recipes/IngredientsList.jsx";
import InstructionsList from "../components/recipes/InstructionsList.jsx";
import RecipeHeader from "../components/recipes/RecipeHeader.jsx";
import RecipeTags from "../components/recipes/RecipeTags.jsx";
import strings from "../strings/en.js";

const ingredientGroups = [
  {
    name: "Eggs Benedict",
    ingredients: [
      "2 English muffins, split",
      "4 slices Canadian bacon",
      "4 large eggs",
      "1 tablespoon white vinegar",
      "Salt to taste",
      "Black pepper to taste",
      "Fresh chives for garnish (optional)",
    ],
  },
  {
    name: "Hollandaise Sauce",
    ingredients: [
      "2 egg yolks",
      "1 tablespoon lemon juice",
      "1/2 cup unsalted butter, melted",
      "Salt to taste",
      "Cayenne pepper to taste (optional)",
    ],
  },
];

const instructions = [
  "Toast the English muffin halves until lightly golden.",
  "Heat a skillet over medium heat and warm the Canadian bacon for 1 to 2 minutes per side. Set aside.",
  "To make the hollandaise sauce, whisk the egg yolks and lemon juice together in a heatproof bowl until slightly thickened.",
  "Place the bowl over a pot of gently simmering water, making sure the bottom of the bowl does not touch the water. Slowly whisk in the melted butter until the sauce is smooth and thickened.",
  "Season the hollandaise with salt and, if desired, a small pinch of cayenne pepper. Keep warm.",
  "Fill a saucepan with several inches of water and bring it to a gentle simmer. Add the vinegar.",
  "Crack each egg into a small bowl. Gently slide the eggs into the simmering water and poach for about 3 to 4 minutes, until the whites are set but the yolks remain soft.",
  "Remove the eggs with a slotted spoon and let them drain briefly.",
  "Assemble each serving by placing two toasted English muffin halves on a plate. Top each half with Canadian bacon and a poached egg.",
  "Spoon hollandaise sauce over the poached eggs.",
  "Season with black pepper and garnish with fresh chives if desired. Serve immediately.",
];

export default function RecipeOfTheDay() {
  return (
    <main>
      <article>
        <RecipeHeader
          title="Eggs Benedict"
          description="A classic breakfast made with toasted English muffins, Canadian bacon, poached eggs, and creamy hollandaise sauce. It's a delicious way to turn a few simple ingredients into a satisfying meal."
          prepTime="10 minutes"
          cookTime="20 minutes"
          totalTime="30 minutes"
          servings="2"
        />
        <figure className="recipe-detail-photo">
          <img src={eggsBenedictImage} alt="Eggs Benedict with hollandaise sauce" />
        </figure>
        <IngredientsList groups={ingredientGroups} />
        <InstructionsList instructions={instructions} />
        <RecipeTags tags={["Breakfast", "Eggs", "Classic", "Brunch"]} />
        <section>
          <h2>{strings.recipes.haveIngredientsHeading}</h2>
          <p>
            {strings.recipes.haveIngredientsText}
          </p>
          <Link className="btn" to="/ingredients">{strings.common.updateIngredientsButton}</Link>
        </section>
        <section aria-labelledby="recipe-save-heading">
          <h2 id="recipe-save-heading">{strings.recipes.enjoyRecipeHeading}</h2>
          <p className="recipe-save-description">{strings.recipes.saveRecipeText}</p>
          <div className="recipe-save-actions">
            <button className="btn recipe-save-button" type="button"><span aria-hidden="true">♡</span> {strings.recipes.saveRecipeButton}</button>
            <output id="recipe-save-count" aria-live="polite">{strings.recipes.saveCountInitial}</output>
          </div>
        </section>
      </article>
    </main>
  );
}