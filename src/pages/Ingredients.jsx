import { Link } from "react-router-dom";

function IngredientTable({ headingId, title, records, sortLabels }) {
  return (
    <section className="ingredients-section">
      <h2 id={headingId}>{title}</h2>
      <table aria-labelledby={headingId}>
        <thead>
          <tr>
            <th scope="col" className="ingredient-sort-heading">
              <span>Name</span>
              <details className="ingredient-sort">
                <summary aria-label="Sort by name"><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label="Name sorting options">
                  <button type="button">{sortLabels[0]}</button>
                  <button type="button">{sortLabels[1]}</button>
                </div>
              </details>
            </th>
            <th scope="col">Quantity</th>
            <th scope="col" className="ingredient-sort-heading">
              <span>Last Updated</span>
              <details className="ingredient-sort">
                <summary aria-label="Sort by last updated"><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label="Last updated sorting options">
                  <button type="button">Newest first</button>
                  <button type="button">Oldest first</button>
                </div>
              </details>
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.name}>
              <td>{record.name}</td>
              <td>{record.quantity}</td>
              <td><time dateTime="2026-09-23">2026-09-23</time></td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link className="btn" to="/ingredients">Update Ingredients</Link>
    </section>
  );
}

const shelfStableIngredients = [
  { name: "Flour", quantity: "10 lbs" },
  { name: "Sugar", quantity: "5 lbs" },
  { name: "Rice", quantity: "2 lbs" },
  { name: "Pasta, Fettuccine", quantity: "1 box" },
];

const refrigeratedIngredients = [
  { name: "Eggs", quantity: "1 dozen" },
  { name: "Milk", quantity: "1 gallon" },
  { name: "Cheese, Pepper Jack", quantity: "1 lb" },
  { name: "Butter, salted", quantity: "4 sticks" },
];

export default function Ingredients() {
  return (
    <main>
      <h1>Ingredients</h1>
      <p>This is only available if you have signed in.</p>
      <IngredientTable
        headingId="shelf-stable-heading"
        title="Shelf Stable Ingredients"
        records={shelfStableIngredients}
        sortLabels={["Sort A–Z", "Sort Z–A"]}
      />
      <IngredientTable
        headingId="refrigerated-heading"
        title="Refrigerated Ingredients"
        records={refrigeratedIngredients}
        sortLabels={["A–Z", "Z–A"]}
      />
    </main>
  );
}