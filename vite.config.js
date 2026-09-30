import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    rolldownOptions: {
      input: {
        home: resolve(projectRoot, "index.html"),
        about: resolve(projectRoot, "about.html"),
        ingredients: resolve(projectRoot, "ingredients.html"),
        login: resolve(projectRoot, "login.html"),
        recipeExample: resolve(projectRoot, "recipe-example.html"),
        recipeOfTheDay: resolve(projectRoot, "recipe-of-the-day.html"),
        recipes: resolve(projectRoot, "recipes.html"),
        userhome: resolve(projectRoot, "userhome.html"),
      },
    },
  },
})
