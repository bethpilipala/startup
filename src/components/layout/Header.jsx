import Navigation from "./Navigation.jsx";
import strings from "../../strings/en.js";

export default function Header() {
  return (
    <header>
      <div className="site-brand">
        <img className="site-logo" src="/images/the_partial_pantry_logo_white.svg" alt="" />
        <h1>{strings.common.siteName}</h1>
      </div>
      <Navigation />
      <hr />
    </header>
  );
}