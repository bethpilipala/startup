export default function CategoryCard({ name = "Category", image, imageAlt = "" }) {
  return (
    <div className="recipe-category-card">
      {image && <img src={image} alt={imageAlt} />}
      <p>{name}</p>
    </div>
  );
}