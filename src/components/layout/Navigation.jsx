import { NavLink, useNavigate } from "react-router-dom";
import strings from "../../strings/en.js";

const navigationLinks = [
  { label: strings.navigation.home, to: "/", page: "home" },
  { label: strings.navigation.about, to: "/about", page: "about" },
  { label: strings.navigation.recipes, to: "/recipes", page: "recipes" },
  { label: strings.navigation.ingredients, to: "/ingredients", page: "ingredients" },
];

export default function Navigation({ user, onLogout }) {
  const navigate = useNavigate();
  const accountLink = user
    ? { label: strings.navigation.myPantry, to: "/userhome" }
    : { label: strings.navigation.login, to: "/login" };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    navigate(`/recipes/results${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <nav aria-label={strings.navigation.mainNavigationLabel}>
      <ul>
        {[...navigationLinks, accountLink].map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.to === "/"}>
              {link.label}
            </NavLink>
          </li>
        ))}
        {user && (
          <li>
            <button className="btn" type="button" onClick={onLogout}>
              {strings.navigation.logout}
            </button>
          </li>
        )}
      </ul>
      <form className="site-recipe-search d-flex align-items-center gap-2 ms-auto" role="search" aria-label={strings.common.searchRecipesLabel} onSubmit={handleSearchSubmit}>
        <label className="visually-hidden" htmlFor="site-recipe-search">{strings.common.searchRecipesLabel}</label>
        <input className="form-control" id="site-recipe-search" name="q" type="search" placeholder={strings.common.findRecipePlaceholder} />
        <button className="btn" type="submit">{strings.common.searchButton}</button>
      </form>
    </nav>
  );
}