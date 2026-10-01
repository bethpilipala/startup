import Navigation from "./Navigation.jsx";
import strings from "../../strings/en.js";

export default function Header() {
  return (
    <header>
      <h1>{strings.common.siteName}</h1>
      <Navigation />
      <hr />
    </header>
  );
}