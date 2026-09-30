export default function RecipeCard({
  title = "Recipe title",
  href = "#",
  image,
  imageAlt = "",
  className = "",
}) {
  return (
    <a className={className || undefined} href={href}>
      <figure>
        {image && <img src={image} alt={imageAlt} />}
        <figcaption><h3>{title}</h3></figcaption>
      </figure>
    </a>
  );
}