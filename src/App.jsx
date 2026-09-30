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
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

const activePages = {
  "/": "home",
  "/about": "about",
  "/ingredients": "ingredients",
  "/login": "login",
  "/recipe-example": "recipes",
  "/recipe-of-the-day": "recipes",
  "/recipes": "recipes",
  "/userhome": "userhome",
};

function SiteLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <Header activePage={activePages[pathname] || ""} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ingredients" element={<Ingredients />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipe-example" element={<RecipeExample />} />
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
    <HashRouter>
      <SiteLayout />
    </HashRouter>
  );
}
