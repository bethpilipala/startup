import { Link } from "react-router-dom";

export default function RecipeResultCard({ recipe }) {
  return (
    <Link className="recipe-result-card" to={recipe.path}>
      <figure>
        {recipe.image && <img src={recipe.image} alt={recipe.imageAlt || ""} />}
        <figcaption>
          <h3>{recipe.title}</h3>
        </figcaption>
      </figure>
    </Link>
  );
}
