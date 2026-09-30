const navigationLinks = [
  { label: "Home", href: "index.html" },
  { label: "About", href: "about.html" },
  { label: "Recipes", href: "recipes.html" },
  { label: "Ingredients", href: "ingredients.html" },
];

export default function Navigation({ activePage = "" }) {
  const accountLink = activePage === "userhome"
    ? { label: "My Pantry", href: "userhome.html", page: "userhome" }
    : { label: "Login", href: "login.html", page: "login" };

  return (
    <nav aria-label="Main navigation">
      <ul>
        {[...navigationLinks, accountLink].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={activePage === (link.page || link.label.toLowerCase()) ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <form className="site-recipe-search d-flex align-items-center gap-2 ms-auto" role="search" aria-label="Search recipes" action="/search" method="get">
        <label className="visually-hidden" htmlFor="site-recipe-search">Search recipes</label>
        <input className="form-control" id="site-recipe-search" name="q" type="search" placeholder="Find a recipe" />
        <button className="btn" type="submit">Search</button>
      </form>
    </nav>
  );
}