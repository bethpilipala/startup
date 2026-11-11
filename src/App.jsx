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
import RecipePage from "./pages/RecipePage.jsx";
import RecipeResults from "./pages/RecipeResults.jsx";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { getCurrentUser, logout } from "./services/auth.js";
import PantryProvider from "./services/PantryProvider.jsx";
import strings from "./strings/en.js";

function ProtectedRoute({ user, authStatus, authError, onRetry, children }) {
  const location = useLocation();

  if (authStatus === "loading") {
    return <main><p role="status">{strings.login.checkingSession}</p></main>;
  }
  if (authStatus === "error") {
    return (
      <main>
        <p role="alert">{authError}</p>
        <button className="btn" type="button" onClick={onRetry}>{strings.recipes.retryButton}</button>
      </main>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function SiteLayout() {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState("loading");
  const [authError, setAuthError] = useState("");
  const [sessionAttempt, setSessionAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getCurrentUser().then(
      (currentUser) => {
        if (active) {
          setUser(currentUser);
          setAuthStatus("ready");
        }
      },
      (error) => {
        if (active) {
          if (error.status === 401) {
            setUser(null);
            setAuthStatus("ready");
          } else {
            setAuthError(error.message);
            setAuthStatus("error");
          }
        }
      },
    );
    return () => { active = false; };
  }, [sessionAttempt]);

  const handleAuthenticate = (authenticatedUser) => {
    setUser(authenticatedUser);
    setAuthStatus("ready");
    setAuthError("");
  };

  const handleLogout = async () => {
    setAuthError("");
    try {
      await logout();
      setUser(null);
      setAuthStatus("ready");
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const retrySession = () => {
    setAuthError("");
    setAuthStatus("loading");
    setSessionAttempt((attempt) => attempt + 1);
  };

  return (
    <>
      <ScrollToTop />
      <Header user={user} onLogout={handleLogout} />
      {authError && authStatus !== "error" && <p role="alert">{authError}</p>}
      <PantryProvider key={`${authStatus}:${user?.email ?? "guest"}`} user={user} authStatus={authStatus}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/ingredients"
          element={
            <ProtectedRoute user={user} authStatus={authStatus} authError={authError} onRetry={retrySession}>
              <Ingredients />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={
          authStatus === "loading" ? (
            <main><p role="status">{strings.login.checkingSession}</p></main>
          ) : authStatus === "error" ? (
            <main>
              <p role="alert">{authError}</p>
              <button className="btn" type="button" onClick={retrySession}>{strings.recipes.retryButton}</button>
            </main>
          ) : <Login onAuthenticate={handleAuthenticate} />
        } />
        <Route path="/random-recipe" element={<RandomRecipe user={user} />} />
        <Route path="/recipe-of-the-day" element={<RecipeOfTheDay user={user} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipes/results" element={<RecipeResults />} />
        <Route path="/recipes/:recipeId" element={<RecipePage user={user} />} />
        <Route
          path="/userhome"
          element={
            <ProtectedRoute user={user} authStatus={authStatus} authError={authError} onRetry={retrySession}>
              <UserHome user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </PantryProvider>
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
