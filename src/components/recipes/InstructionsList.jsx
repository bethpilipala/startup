import strings from "../../strings/en.js";

export default function InstructionsList({ instructions = [] }) {
  return (
    <section>
      <h2>{strings.recipes.instructionsHeading}</h2>
      {instructions.length === 0 && <p>{strings.recipes.notProvided}</p>}
      <ol>
        {instructions.map((instruction, index) => (
          <li key={`${instruction}-${index}`}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}