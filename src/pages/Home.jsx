import eggsBenedictImage from "../../images/eggs_benedict.jpg";
import RecipeCard from "../components/recipes/RecipeCard.jsx";

export default function Home() {
  return (
    <main>
      <h1 className="home-page-title">The Partial Pantry</h1>
      <p className="home-intro">
        Don&apos;t let a few missing ingredients stop you from cooking! Browse by meal, add ingredients to your pantry, or try today&apos;s featured recipe.
      </p>
      <section className="recipe-of-the-day" aria-labelledby="recipe-of-the-day-heading">
        <h2 id="recipe-of-the-day-heading">Recipe of the Day</h2>
        <RecipeCard
          className="recipe-of-the-day-link"
          href="recipe-of-the-day.html"
          title="Eggs Benedict"
          image={eggsBenedictImage}
          imageAlt=""
        />
      </section>
    </main>
  );
}