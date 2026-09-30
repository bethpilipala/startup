import { Link } from "react-router-dom";
import strings from "../strings/en.js";

function IngredientTable({ headingId, title, records, sortLabels }) {
  return (
    <section className="ingredients-section">
      <h2 id={headingId}>{title}</h2>
      <table aria-labelledby={headingId}>
        <thead>
          <tr>
            <th scope="col" className="ingredient-sort-heading">
              <span>{strings.ingredients.nameHeader}</span>
              <details className="ingredient-sort">
                <summary aria-label={strings.ingredients.sortByNameLabel}><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label={strings.ingredients.nameSortMenuLabel}>
                  <button type="button">{sortLabels[0]}</button>
                  <button type="button">{sortLabels[1]}</button>
                </div>
              </details>
            </th>
            <th scope="col">{strings.ingredients.quantityHeader}</th>
            <th scope="col" className="ingredient-sort-heading">
              <span>{strings.ingredients.lastUpdatedHeader}</span>
              <details className="ingredient-sort">
                <summary aria-label={strings.ingredients.sortByLastUpdatedLabel}><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label={strings.ingredients.lastUpdatedSortMenuLabel}>
                  <button type="button">{strings.ingredients.newestFirstLabel}</button>
                  <button type="button">{strings.ingredients.oldestFirstLabel}</button>
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
      <Link className="btn" to="/ingredients">{strings.common.updateIngredientsButton}</Link>
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
      <h1>{strings.ingredients.pageTitle}</h1>
      <p>{strings.ingredients.signInNotice}</p>
      <IngredientTable
        headingId="shelf-stable-heading"
        title={strings.ingredients.shelfStableHeading}
        records={shelfStableIngredients}
        sortLabels={[strings.ingredients.sortNameAscLabel, strings.ingredients.sortNameDescLabel]}
      />
      <IngredientTable
        headingId="refrigerated-heading"
        title={strings.ingredients.refrigeratedHeading}
        records={refrigeratedIngredients}
        sortLabels={[strings.ingredients.sortNameAscShortLabel, strings.ingredients.sortNameDescShortLabel]}
      />
    </main>
  );
}