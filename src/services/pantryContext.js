import { createContext, useContext } from "react";

export const PantryContext = createContext(null);

export function usePantry() {
  const context = useContext(PantryContext);
  if (!context) throw new Error("PantryProvider is missing.");
  return context;
}
