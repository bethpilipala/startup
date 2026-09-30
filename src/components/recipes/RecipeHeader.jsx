import strings from "../../strings/en.js";

export default function RecipeHeader({
  title = "Recipe title",
  description = "Recipe description",
  prepTime = "Not specified",
  cookTime = "Not specified",
  totalTime = "Not specified",
  servings = "Not specified",
}) {
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