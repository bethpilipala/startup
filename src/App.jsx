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
import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { APP_STORAGE_KEYS, getStorageItem, removeStorageItem, setStorageItem } from "./services/storage.js";

function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function SiteLayout() {
  const [user, setUser] = useState(() => getStorageItem(APP_STORAGE_KEYS.user));

  const handleAuthenticate = (email) => {
    const authenticatedUser = {
      email,
      name: email.split("@")[0],
    };
    setStorageItem(APP_STORAGE_KEYS.user, authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    removeStorageItem(APP_STORAGE_KEYS.user);
    setUser(null);
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute user={user}>
              <Ingredients />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login onAuthenticate={handleAuthenticate} />} />
        <Route path="/random-recipe" element={<RandomRecipe />} />
        <Route path="/recipe-of-the-day" element={<RecipeOfTheDay />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/userhome"
          element={
            <ProtectedRoute user={user}>
              <UserHome />
            </ProtectedRoute>
          }
        />
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
