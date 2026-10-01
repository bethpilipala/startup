import foodBanner from "../../images/food_banner.jpg";
import strings from "../strings/en.js";

export default function About() {
  return (
    <main>
      <h1>{strings.about.title}</h1>
      {strings.about.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <img className="about-banner" src={foodBanner} alt="" />
    </main>
  );
}