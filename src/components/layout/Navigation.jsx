import { NavLink } from "react-router-dom";
import strings from "../../strings/en.js";

const navigationLinks = [
  { label: strings.navigation.home, to: "/", page: "home" },
  { label: strings.navigation.about, to: "/about", page: "about" },
  { label: strings.navigation.recipes, to: "/recipes", page: "recipes" },
  { label: strings.navigation.ingredients, to: "/ingredients", page: "ingredients" },
];

export default function Navigation({ activePage = "" }) {
  const accountLink = activePage === "userhome"
    ? { label: strings.navigation.myPantry, to: "/userhome", page: "userhome" }
    : { label: strings.navigation.login, to: "/login", page: "login" };

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
      </ul>
      <form className="site-recipe-search d-flex align-items-center gap-2 ms-auto" role="search" aria-label={strings.common.searchRecipesLabel} action="/search" method="get">
        <label className="visually-hidden" htmlFor="site-recipe-search">{strings.common.searchRecipesLabel}</label>
        <input className="form-control" id="site-recipe-search" name="q" type="search" placeholder={strings.common.findRecipePlaceholder} />
        <button className="btn" type="submit">{strings.common.searchButton}</button>
      </form>
    </nav>
  );
}