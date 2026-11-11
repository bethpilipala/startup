import strings from "../../strings/en.js";

export default function RecipeHeader({ title, description, prepTime, cookTime, totalTime, servings }) {
  const details = [
    [strings.recipes.prepTimeLabel, prepTime],
    [strings.recipes.cookTimeLabel, cookTime],
    [strings.recipes.totalTimeLabel, totalTime],
    [strings.recipes.servingsLabel, servings],
  ].filter(([, value]) => value);

  return (
    <header>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {details.length > 0 && (
        <p>
          {details.map(([label, value], index) => (
            <span key={label}>
              {index > 0 && <br />}
              <strong>{label}</strong> {value}
            </span>
          ))}
        </p>
      )}
    </header>
  );
}