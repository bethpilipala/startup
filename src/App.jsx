import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Ingredients from "./pages/Ingredients.jsx";
import Login from "./pages/Login.jsx";
import RecipeExample from "./pages/RecipeExample.jsx";
import RecipeOfTheDay from "./pages/RecipeOfTheDay.jsx";
import Recipes from "./pages/Recipes.jsx";
import UserHome from "./pages/UserHome.jsx";

const pages = {
  "/": { name: "home", component: Home },
  "/index.html": { name: "home", component: Home },
  "/about.html": { name: "about", component: About },
  "/ingredients.html": { name: "ingredients", component: Ingredients },
  "/login.html": { name: "login", component: Login },
  "/recipe-example.html": { name: "recipes", component: RecipeExample },
  "/recipe-of-the-day.html": { name: "recipes", component: RecipeOfTheDay },
  "/recipes.html": { name: "recipes", component: Recipes },
  "/userhome.html": { name: "userhome", component: UserHome },
};

export default function App() {
  const page = pages[window.location.pathname] || pages["/"];
  const Page = page.component;

  return (
    <>
      <Header activePage={page.name} />
      <Page />
      <Footer />
    </>
  );
}
