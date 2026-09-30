import { Link } from "react-router-dom";

export default function RecipeCard({
  title = "Recipe title",
  href = "#",
  image,
  imageAlt = "",
  className = "",
}) {
  return (
    <Link className={className || undefined} to={href}>
      <figure>
        {image && <img src={image} alt={imageAlt} />}
        <figcaption><h3>{title}</h3></figcaption>
      </figure>
    </Link>
  );
}