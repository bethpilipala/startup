import CategoryCard from "./CategoryCard.jsx";

export default function CategoryList({ categories = [] }) {
  return (
    <section aria-label="Recipe categories">
      <div className="row row-cols-2 row-cols-md-4 g-3 recipe-category-grid">
        {categories.map((category) => (
          <div className="col" key={category.name}>
            <CategoryCard {...category} />
          </div>
        ))}
      </div>
    </section>
  );
}