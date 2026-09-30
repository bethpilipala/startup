export default function CategoryCard({ name = "Category", href = "#", image, imageAlt = "" }) {
  return (
    <article>
      <a href={href}>
        {image && <img src={image} alt={imageAlt} />}
        <h3>{name}</h3>
      </a>
    </article>
  );
}