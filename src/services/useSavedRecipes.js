import { useEffect, useState } from "react";
import { recipes } from "../data/recipes.js";
import { getRecipe } from "./spoonacular.js";

export default function useSavedRecipes(ids) {
  const key = JSON.stringify(ids);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    const savedIds = JSON.parse(key);
    Promise.allSettled(savedIds.map((id) => {
      const localRecipe = recipes.find((recipe) => recipe.id === String(id));
      if (localRecipe) return Promise.resolve(localRecipe);
      if (/^\d+$/.test(String(id))) return getRecipe(id);
      return Promise.reject(new Error("A saved recipe ID is no longer available."));
    })).then((results) => {
      if (!active) return;
      setResult({
        key,
        recipes: results.filter((item) => item.status === "fulfilled").map((item) => item.value),
        errors: results.filter((item) => item.status === "rejected").map((item) => item.reason.message),
      });
    });
    return () => { active = false; };
  }, [key]);

  if (result?.key !== key) {
    return { recipes: [], errors: [], loading: ids.length > 0 };
  }
  return { ...result, loading: false };
}
