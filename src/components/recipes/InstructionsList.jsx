import strings from "../../strings/en.js";

export default function InstructionsList({ instructions = [] }) {
  return (
    <section>
      <h2>{strings.recipes.instructionsHeading}</h2>
      <ol>
        {instructions.map((instruction, index) => (
          <li key={`${instruction}-${index}`}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}