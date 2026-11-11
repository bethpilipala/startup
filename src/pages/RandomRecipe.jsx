import { useEffect, useRef, useState } from "react";
import RecipeDetails from "../components/recipes/RecipeDetails.jsx";
import { recipes } from "../data/recipes.js";
import { getRandomRecipe } from "../services/spoonacular.js";
import strings from "../strings/en.js";

function chooseLocalRecipe(currentId) {
  const choices = recipes.filter((recipe) => recipe.id !== currentId);
  const options = choices.length > 0 ? choices : recipes;
  return options[Math.floor(Math.random() * options.length)];
}

function chooseRandomRecipe(currentId) {
  return Math.random() < 0.5
    ? Promise.resolve(chooseLocalRecipe(currentId))
    : getRandomRecipe();
}

export default function RandomRecipe({ user }) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initialRequest = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    if (!initialRequest.current) {
      initialRequest.current = chooseRandomRecipe(null);
    }
    initialRequest.current.then(
      (selected) => {
        if (mounted.current) {
          setRecipe(selected);
          setLoading(false);
        }
      },
      (requestError) => {
        if (mounted.current) {
          setError(requestError.message);
          setLoading(false);
        }
      },
    );
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!recipe) return;
    window.scrollTo(0, 0);
    document.title = `${recipe.title} | The Partial Pantry`;
    return () => {
      document.title = "The Partial Pantry";
    };
  }, [recipe]);

  const handleAnother = async () => {
    setError("");
    setLoading(true);
    try {
      const selected = await chooseRandomRecipe(recipe?.id);
      if (mounted.current) setRecipe(selected);
    } catch (requestError) {
      if (mounted.current) setError(requestError.message);
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <>
      {recipe ? (
        <RecipeDetails key={recipe.id} recipe={recipe} user={user} />
      ) : (
        <main>
          <h1>{strings.recipes.randomRecipeHeading}</h1>
          {loading && <p role="status">{strings.recipes.loadingRecipes}</p>}
          {error && <p role="alert">{error}</p>}
        </main>
      )}
      <div className="random-recipe-action">
        {recipe && loading && <p role="status">{strings.recipes.loadingRecipes}</p>}
        {recipe && error && <p role="alert">{error}</p>}
        <button className="btn" type="button" onClick={handleAnother} disabled={loading}>
          {strings.recipes.tryAnotherRecipe}
        </button>
      </div>
    </>
  );
}