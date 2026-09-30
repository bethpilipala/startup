import { Fragment } from "react";
import foodBanner from "../../images/food_banner.jpg";
import strings from "../strings/en.js";

export default function About() {
  return (
    <main>
      <h1>{strings.about.title}</h1>
      <p>
        {strings.about.paragraphs.map((paragraph, index) => (
          <Fragment key={paragraph}>
            {paragraph}
            {index < strings.about.paragraphs.length - 1 && (
              <>
                <br /><br />
              </>
            )}
          </Fragment>
        ))}
      </p>
      <img className="about-banner" src={foodBanner} alt="" />
    </main>
  );
}