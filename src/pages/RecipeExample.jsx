import { Link } from "react-router-dom";
import pastaPrimaveraImage from "../../images/pasta-primavera.jpg";
import IngredientsList from "../components/recipes/IngredientsList.jsx";
import InstructionsList from "../components/recipes/InstructionsList.jsx";
import RecipeHeader from "../components/recipes/RecipeHeader.jsx";
import RecipeTags from "../components/recipes/RecipeTags.jsx";

const ingredients = [
  "12 oz pasta",
  "1 tablespoon olive oil",
  "1 zucchini",
  "1 bell pepper",
  "1 cup broccoli",
  "1 cup cherry tomatoes",
  "2 cloves garlic",
  "1/2 cup Parmesan cheese",
  "Salt to taste",
  "Black pepper to taste",
];

const instructions = [
  "Bring a large pot of salted water to a boil. Cook the pasta according to the package instructions.",
  "While the pasta is cooking, wash and chop the vegetables.",
  "Heat the olive oil in a large pan over medium heat.",
  "Add the garlic, zucchini, bell pepper, and broccoli. Cook until the vegetables are tender.",
  "Add the cherry tomatoes and cook for another 2 to 3 minutes.",
  "Drain the pasta and add it to the pan with the vegetables.",
  "Season with salt and black pepper and toss everything together.",
  "Sprinkle Parmesan cheese over the pasta and serve.",
];

export default function RecipeExample() {
  return (
    <main>
      <article>
        <RecipeHeader
          title="Pasta Primavera"
          description="A simple pasta dish packed with fresh vegetables. This recipe is a great way to use up ingredients you already have in your kitchen."
          prepTime="15 minutes"
          cookTime="20 minutes"
          totalTime="35 minutes"
          servings="4"
        />
        <figure className="recipe-detail-photo">
          <img src={pastaPrimaveraImage} alt="Pasta Primavera with vegetables and Parmesan" />
        </figure>
        <IngredientsList ingredients={ingredients} />
        <InstructionsList instructions={instructions} />
        <RecipeTags tags={["Vegetarian", "Pasta", "Quick Meals", "Italian-Inspired"]} />
        <section>
          <h2>Have the Ingredients?</h2>
          <p>
            The Partial Pantry can help you find recipes based on
            the ingredients you already have at home.
          </p>
          <Link className="btn" to="/ingredients">Update Ingredients</Link>
        </section>
        <section aria-labelledby="recipe-save-heading">
          <h2 id="recipe-save-heading">Enjoy this recipe?</h2>
          <p className="recipe-save-description">Save this recipe to your My Pantry page.</p>
          <div className="recipe-save-actions">
            <button className="btn recipe-save-button" type="button"><span aria-hidden="true">♡</span> Save Recipe</button>
            <output id="recipe-save-count" aria-live="polite">0 saves</output>
          </div>
        </section>
      </article>
    </main>
  );
}