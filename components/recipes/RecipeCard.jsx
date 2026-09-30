export default function RecipeCard({ title = "Recipe title", href = "#", image, imageAlt = "" }) {
  return (
    <article>
      <a href={href}>
        {image && <img src={image} alt={imageAlt} />}
        <h3>{title}</h3>
      </a>
    </article>
  );
}