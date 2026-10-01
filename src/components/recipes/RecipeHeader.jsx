import strings from "../../strings/en.js";

export default function RecipeHeader({ title, description, prepTime, cookTime, totalTime, servings }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        <strong>{strings.recipes.prepTimeLabel}</strong> {prepTime}
        <br />
        <strong>{strings.recipes.cookTimeLabel}</strong> {cookTime}
        <br />
        <strong>{strings.recipes.totalTimeLabel}</strong> {totalTime}
        <br />
        <strong>{strings.recipes.servingsLabel}</strong> {servings}
      </p>
    </header>
  );
}