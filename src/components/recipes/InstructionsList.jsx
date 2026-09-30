export default function InstructionsList({ instructions = [] }) {
  return (
    <section>
      <h2>Instructions</h2>
      <ol>
        {instructions.map((instruction, index) => (
          <li key={`${instruction}-${index}`}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}