export default function IngredientsList({ ingredients = [], groups = [] }) {
  return (
    <section>
      <h2>Ingredients</h2>
      {groups.length > 0
        ? groups.map((group) => (
            <div key={group.name}>
              <h3>{group.name}</h3>
              <ul>
                {group.ingredients.map((ingredient, index) => (
                  <li key={`${group.name}-${ingredient}-${index}`}>{ingredient}</li>
                ))}
              </ul>
            </div>
          ))
        : (
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={`${ingredient}-${index}`}>{ingredient}</li>
              ))}
            </ul>
          )}
    </section>
  );
}