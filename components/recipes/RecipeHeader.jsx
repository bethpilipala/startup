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
      <dl>
        <dt>Prep time</dt>
        <dd>{prepTime}</dd>
        <dt>Cook time</dt>
        <dd>{cookTime}</dd>
        <dt>Total time</dt>
        <dd>{totalTime}</dd>
        <dt>Servings</dt>
        <dd>{servings}</dd>
      </dl>
    </header>
  );
}