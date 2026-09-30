import { Link } from "react-router-dom";

const pantryIngredients = [
  ["Flour", "10 lbs"],
  ["Sugar", "5 lbs"],
  ["Rice", "2 lbs"],
  ["Pasta, Fettuccine", "1 box"],
  ["Eggs", "1 dozen"],
  ["Milk", "1 gallon"],
  ["Cheese, Pepper Jack", "1 lb"],
  ["Butter, salted", "4 sticks"],
];

export default function UserHome() {
  return (
    <main className="userhome">
      <h1>My Pantry</h1>
      <div className="row g-4 userhome-overview">
        <div className="col-lg-7">
          <section className="userhome-recipes" aria-labelledby="your-recipes-heading">
            <h2 id="your-recipes-heading">My Recipes</h2>
            <div className="row row-cols-1 row-cols-md-2 g-3 userhome-recipe-grid">
              <div className="col">
                <div className="userhome-empty-state" role="status">
                  <p>No recipes saved yet.</p>
                  <p>Recipes you save will appear here.</p>
                  <Link to="/recipes">Explore recipes</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="col-lg-5">
          <section className="userhome-ingredients" aria-labelledby="your-ingredients-heading">
            <div className="userhome-section-heading">
              <h2 id="your-ingredients-heading">My Ingredients</h2>
              <Link to="/ingredients">View all</Link>
            </div>
            <ul className="list-group list-group-flush userhome-ingredient-list">
              {pantryIngredients.map(([name, quantity]) => (
                <li className="list-group-item d-flex justify-content-between" key={name}>
                  <span>{name}</span><span>{quantity}</span>
                </li>
              ))}
            </ul>
            <Link className="btn" to="/ingredients">Update Ingredients</Link>
          </section>
        </div>
      </div>
    </main>
  );
}