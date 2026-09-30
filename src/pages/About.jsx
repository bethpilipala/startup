import foodBanner from "../../images/food_banner.jpg";

export default function About() {
  return (
    <main>
      <h1>About</h1>
      <p>
        Sometimes you have plenty of food in the kitchen, you just don&apos;t have everything a recipe calls for.
        <br /><br />
        Maybe you have a few vegetables, some pasta, a can of beans, and a handful of spices, but you can&apos;t get to the store. You don&apos;t want to spend money on more groceries, and you definitely don&apos;t want the food you already have to go to waste.
        <br /><br />
        That&apos;s why I created The Partial Pantry.
        <br /><br />
        The Partial Pantry helps you figure out what you can make with what you already have. Instead of finding a recipe and then making a shopping list, you start with the ingredients in your kitchen. Enter what you have on hand, and The Partial Pantry finds recipes that use only those ingredients.
        <br /><br />
        You can also create an account, save your favorite recipes, and keep track of the ingredients you currently have. Pantry staples like spices and canned or dry goods can stay on your list, while ingredients that come and go, like fresh fruits and vegetables, can be updated as needed.
        <br /><br />
        The idea is simple: don&apos;t start with what a recipe needs. Start with what you already have.
        <br /><br />
        Whether you&apos;re trying to avoid an extra trip to the grocery store, save a little money, use up ingredients before they go bad, or just figure out what you can make for dinner, The Partial Pantry is here to help.
      </p>
      <img className="about-banner" src={foodBanner} alt="" />
    </main>
  );
}