import { useEffect, useState } from "react";
import { getLocalDay, getRecipeOfTheDay } from "./recipeOfTheDay.js";

export default function useRecipeOfTheDay() {
  const [day, setDay] = useState(getLocalDay);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    getRecipeOfTheDay().then(
      (recipe) => { if (active) setResult({ day, attempt, recipe }); },
      (error) => { if (active) setResult({ day, attempt, error: error.message }); },
    );
    return () => { active = false; };
  }, [day, attempt]);

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = window.setTimeout(() => setDay(getLocalDay()), midnight - now + 100);
    const checkDay = () => setDay(getLocalDay());
    window.addEventListener("focus", checkDay);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", checkDay);
    };
  }, [day]);

  const current = result?.day === day && result?.attempt === attempt ? result : null;
  return {
    recipe: current?.recipe,
    error: current?.error,
    loading: !current,
    retry: () => setAttempt((value) => value + 1),
  };
}
