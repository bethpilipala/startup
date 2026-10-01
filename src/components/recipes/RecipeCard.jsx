import { Link } from "react-router-dom";

export default function RecipeCard({
  recipe,
  className = "",
  imageAlt = recipe.imageAlt || "",
}) {
  return (
    <Link className={className || undefined} to={recipe.path}>
      <figure>
        {recipe.image && <img src={recipe.image} alt={imageAlt} />}
        <figcaption><h3>{recipe.title}</h3></figcaption>
      </figure>
    </Link>
  );
}