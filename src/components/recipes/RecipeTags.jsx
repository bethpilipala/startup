import strings from "../../strings/en.js";

export default function RecipeTags({ tags = [] }) {
  return (
    <section>
      <h2>{strings.recipes.tagsHeading}</h2>
      <ul className="recipe-tags">
        {tags.map((tag) => (
          <li className="badge" key={tag}>{tag}</li>
        ))}
      </ul>
    </section>
  );
}