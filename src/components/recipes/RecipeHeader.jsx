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
        <strong>Prep time:</strong> {prepTime}
        <br />
        <strong>Cook time:</strong> {cookTime}
        <br />
        <strong>Total time:</strong> {totalTime}
        <br />
        <strong>Servings:</strong> {servings}
      </p>
    </header>
  );
}