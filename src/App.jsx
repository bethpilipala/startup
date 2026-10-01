import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Ingredients from "./pages/Ingredients.jsx";
import Login from "./pages/Login.jsx";
import RandomRecipe from "./pages/RandomRecipe.jsx";
import RecipeOfTheDay from "./pages/RecipeOfTheDay.jsx";
import Recipes from "./pages/Recipes.jsx";
import UserHome from "./pages/UserHome.jsx";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function SiteLayout() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/login" element={<Login />} />
        <Route path="/random-recipe" element={<RandomRecipe />} />
        <Route path="/recipe-of-the-day" element={<RecipeOfTheDay />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteLayout />
    </BrowserRouter>
  );
}
