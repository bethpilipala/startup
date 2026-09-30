export default function RecipeTags({ tags = [] }) {
  return (
    <section>
      <h2>Recipe tags</h2>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </section>
  );
}