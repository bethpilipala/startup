const navigationLinks = [
  { label: "Home", href: "index.html" },
  { label: "About", href: "about.html" },
  { label: "Recipes", href: "recipes.html" },
  { label: "Ingredients", href: "ingredients.html" },
  { label: "Login", href: "login.html" },
];

export default function Navigation({ activePage = "" }) {
  return (
    <nav aria-label="Main navigation">
      <ul>
        {navigationLinks.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={activePage === link.label.toLowerCase() ? "page" : undefined}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <form role="search" aria-label="Search recipes">
        <label htmlFor="site-recipe-search">Search recipes</label>
        <input id="site-recipe-search" name="q" type="search" placeholder="Find a recipe" />
        <button type="submit">Search</button>
      </form>
    </nav>
  );
}