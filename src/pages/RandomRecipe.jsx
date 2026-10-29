import { useEffect, useState } from "react";
import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { recipes } from "../data/recipes.js";

function chooseRandomRecipe(currentId) {
  const choices = recipes.filter((recipe) => recipe.id !== currentId);
  const options = choices.length > 0 ? choices : recipes;
  return options[Math.floor(Math.random() * options.length)];
}

export default function RandomRecipe() {
  const [recipe, setRecipe] = useState(() => chooseRandomRecipe(null));

  useEffect(() => {
    document.title = `${recipe.title} | The Partial Pantry`;
    return () => {
      document.title = "The Partial Pantry";
    };
  }, [recipe]);

  return (
    <>
      <RecipeDetails recipe={recipe} />
      <div className="random-recipe-action">
        <button className="btn" type="button" onClick={() => setRecipe((current) => chooseRandomRecipe(current.id))}>
          Try another random recipe
        </button>
      </div>
    </>
  );
}