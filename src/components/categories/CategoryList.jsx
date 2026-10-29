import CategoryCard from "./CategoryCard.jsx";
import strings from "../../strings/en.js";
import { Link } from "react-router-dom";

export default function CategoryList({ categories = [] }) {
  return (
    <section aria-label={strings.recipes.categoriesLabel}>
      <div className="row row-cols-2 row-cols-md-4 g-3 recipe-category-grid">
        {categories.map((category) => (
          <div className="col" key={category.name}>
            <Link className="recipe-category-link" to={`/recipes?category=${encodeURIComponent(category.name)}`}>
              <CategoryCard {...category} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}