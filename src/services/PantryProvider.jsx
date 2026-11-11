import { useEffect, useRef, useState } from "react";
import { PantryContext } from "./pantryContext.js";
import { request } from "./auth.js";
import { APP_STORAGE_KEYS, getStorageItem, getUserFavoritesStorageKey, setStorageItem } from "./storage.js";
import strings from "../strings/en.js";

const migrationKey = "partialPantry.serverImport";
const favoritesMigrationPrefix = "partialPantry.serverFavoritesImport.";
const emptyData = { ingredients: [], favorites: [], recent: [] };

function put(path, data) {
  return request(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function loadUserData(user) {
  const marker = getStorageItem(migrationKey);
  const favoritesMarkerKey = `${favoritesMigrationPrefix}${encodeURIComponent(user.email)}`;
  const importShared = !marker || (marker.email === user.email && !marker.completed);
  const importFavorites = !getStorageItem(favoritesMarkerKey);
  if (importShared || importFavorites) {
    const ingredients = importShared ? getStorageItem(APP_STORAGE_KEYS.ingredients) ?? [] : [];
    const favorites = importFavorites ? getStorageItem(getUserFavoritesStorageKey(user)) ?? [] : [];
    const recent = importShared ? getStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes) ?? [] : [];
    if (importShared) setStorageItem(migrationKey, { email: user.email, completed: false });
    const imported = await request("/data/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients, favorites, recent }),
    });
    if (importShared) setStorageItem(migrationKey, { email: user.email, completed: true });
    if (importFavorites) setStorageItem(favoritesMarkerKey, true);
    return imported;
  }
  const [ingredients, favorites, recent] = await Promise.all([
    request("/ingredients"), request("/favorites"), request("/recent"),
  ]);
  return { ingredients, favorites, recent };
}

export default function PantryProvider({ user, authStatus, children }) {
  const [data, setData] = useState(emptyData);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dataRef = useRef(emptyData);
  const busyRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    activeRef.current = true;
    return () => { activeRef.current = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (authStatus !== "ready") return () => { active = false; };
    const load = user
      ? loadUserData(user)
      : Promise.resolve().then(() => ({
        ...emptyData,
        recent: getStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes) ?? [],
      }));
    load.then(
      (loaded) => {
        if (active) {
          dataRef.current = loaded;
          setData(loaded);
          setStatus("ready");
        }
      },
      (loadError) => {
        if (active) {
          setError(loadError.message);
          setStatus("error");
        }
      },
    );
    return () => { active = false; };
  }, [user, authStatus, attempt]);

  async function update(field, transform) {
    if (status !== "ready" || busyRef.current) return false;
    busyRef.current = true;
    setSaving(true);
    setError("");
    try {
      const next = transform(dataRef.current[field]);
      if (user) {
        await put(`/${field}`, next);
      } else if (field === "recent") {
        setStorageItem(APP_STORAGE_KEYS.recentlyViewedRecipes, next);
      } else {
        throw new Error(strings.pantry.signInRequired);
      }
      const updated = { ...dataRef.current, [field]: next };
      dataRef.current = updated;
      if (activeRef.current) setData(updated);
      return true;
    } catch (saveError) {
      if (activeRef.current) setError(saveError.message);
      return false;
    } finally {
      busyRef.current = false;
      if (activeRef.current) setSaving(false);
    }
  }

  const retry = () => {
    setError("");
    setStatus("loading");
    setAttempt((value) => value + 1);
  };

  return (
    <PantryContext.Provider value={{ ...data, status, error, saving, update, retry }}>
      {children}
    </PantryContext.Provider>
  );
}
