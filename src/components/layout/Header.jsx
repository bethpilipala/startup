import Navigation from "./Navigation.jsx";
import strings from "../../strings/en.js";

export default function Header({ activePage = "" }) {
  return (
    <header>
      <h1>{strings.common.siteName}</h1>
      <Navigation activePage={activePage} />
      <hr />
    </header>
  );
}