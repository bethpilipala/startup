import Navigation from "./Navigation.jsx";

export default function Header({ activePage = "" }) {
  return (
    <header>
      <h1>The Partial Pantry</h1>
      <Navigation activePage={activePage} />
      <hr />
    </header>
  );
}