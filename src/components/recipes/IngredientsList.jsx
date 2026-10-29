import strings from "../../strings/en.js";

function scaleIngredient(ingredient, multiplier) {
  if (multiplier === 1) {
    return ingredient;
  }

  const amountMatch = ingredient.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|\.\d+)(?=\s|$)/);
  if (!amountMatch) {
    return ingredient;
  }

  const amount = amountMatch[1];
  const amountParts = amount.split(/\s+/);
  const value = amountParts.length === 2
    ? Number(amountParts[0]) + Number(amountParts[1].split("/")[0]) / Number(amountParts[1].split("/")[1])
    : amount.includes("/")
      ? Number(amount.split("/")[0]) / Number(amount.split("/")[1])
      : Number(amount);
  const scaledAmount = Number((value * multiplier).toFixed(2));
  return `${scaledAmount}${ingredient.slice(amountMatch[0].length)}`;
}

export default function IngredientsList({ ingredients = [], groups = [], multiplier = 1 }) {
  return (
    <section>
      <h2>{strings.recipes.ingredientsHeading}</h2>
      {groups.length > 0
        ? groups.map((group) => (
            <div key={group.name}>
              <h3>{group.name}</h3>
              <ul>
                {group.ingredients.map((ingredient, index) => (
                  <li key={`${group.name}-${ingredient}-${index}`}>{scaleIngredient(ingredient, multiplier)}</li>
                ))}
              </ul>
            </div>
          ))
        : (
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={`${ingredient}-${index}`}>{scaleIngredient(ingredient, multiplier)}</li>
              ))}
            </ul>
          )}
    </section>
  );
}