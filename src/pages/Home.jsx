import eggsBenedictImage from "../../images/eggs_benedict.jpg";
import RecipeCard from "../components/recipes/RecipeCard.jsx";
import strings from "../strings/en.js";

export default function Home() {
  return (
    <main>
      <h1 className="home-page-title">{strings.common.siteName}</h1>
      <p className="home-intro">
        {strings.home.intro}
      </p>
      <section className="recipe-of-the-day" aria-labelledby="recipe-of-the-day-heading">
        <h2 id="recipe-of-the-day-heading">{strings.home.recipeOfTheDayHeading}</h2>
        <RecipeCard
          className="recipe-of-the-day-link"
          href="/recipe-of-the-day"
          title="Eggs Benedict"
          image={eggsBenedictImage}
          imageAlt=""
        />
      </section>
    </main>
  );
}