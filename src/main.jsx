import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/site.css";
import App from "./App.jsx";
import { initializeAppData } from "./services/storage.js";

initializeAppData();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
