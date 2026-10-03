import strings from "../strings/en.js";

export default function About() {
  return (
    <main>
      <h1>{strings.about.title}</h1>
      {strings.about.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <img className="about-banner" src="/images/food_banner.jpg" alt="" />
    </main>
  );
}