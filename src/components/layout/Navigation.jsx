import { NavLink } from "react-router-dom";

const navigationLinks = [
  { label: "Home", to: "/", page: "home" },
  { label: "About", to: "/about", page: "about" },
  { label: "Recipes", to: "/recipes", page: "recipes" },
  { label: "Ingredients", to: "/ingredients", page: "ingredients" },
];

export default function Navigation({ activePage = "" }) {
  const accountLink = activePage === "userhome"
    ? { label: "My Pantry", to: "/userhome", page: "userhome" }
    : { label: "Login", to: "/login", page: "login" };

  return (
    <nav aria-label="Main navigation">
      <ul>
        {[...navigationLinks, accountLink].map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.to === "/"}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <form className="site-recipe-search d-flex align-items-center gap-2 ms-auto" role="search" aria-label="Search recipes" action="/#/search" method="get">
        <label className="visually-hidden" htmlFor="site-recipe-search">Search recipes</label>
        <input className="form-control" id="site-recipe-search" name="q" type="search" placeholder="Find a recipe" />
        <button className="btn" type="submit">Search</button>
      </form>
    </nav>
  );
}