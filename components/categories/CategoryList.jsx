import CategoryCard from "./CategoryCard.jsx";

export default function CategoryList({ categories = [] }) {
  return (
    <section aria-label="Recipe categories">
      <ul>
        {categories.map((category) => (
          <li key={category.href || category.name}>
            <CategoryCard {...category} />
          </li>
        ))}
      </ul>
    </section>
  );
}