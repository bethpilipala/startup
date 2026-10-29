import { useEffect, useMemo, useState } from "react";
import strings from "../strings/en.js";
import { APP_STORAGE_KEYS, getStorageItem, setStorageItem } from "../services/storage.js";

const categories = [
  { value: "shelf-stable", label: strings.ingredients.shelfStableHeading },
  { value: "refrigerated", label: strings.ingredients.refrigeratedHeading },
];

const freshnessIntervals = {
  "shelf-stable": 30,
  refrigerated: 7,
};

function getToday() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

function getDaysSinceUpdated(updatedAt) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updatedAt ?? "")) {
    return null;
  }

  const [year, month, day] = updatedAt.split("-").map(Number);
  const updatedDate = Date.UTC(year, month - 1, day);
  if (new Date(updatedDate).toISOString().slice(0, 10) !== updatedAt) {
    return null;
  }

  const todayParts = getToday().split("-").map(Number);
  const todayDate = Date.UTC(todayParts[0], todayParts[1] - 1, todayParts[2]);
  const daysSinceUpdated = Math.floor((todayDate - updatedDate) / 86400000);
  return daysSinceUpdated >= 0 ? daysSinceUpdated : null;
}

function IngredientTable({ headingId, title, records, onSortChange, onEdit, onDelete }) {
  const nameSortLabels = [strings.ingredients.sortNameAscLabel, strings.ingredients.sortNameDescLabel];
  const updatedSortLabels = [strings.ingredients.newestFirstLabel, strings.ingredients.oldestFirstLabel];

  return (
    <section className="ingredients-section">
      <h2 id={headingId}>{title}</h2>
      <table aria-labelledby={headingId}>
        <thead>
          <tr>
            <th scope="col" className="ingredient-sort-heading">
              <span>{strings.ingredients.nameHeader}</span>
              <details className="ingredient-sort">
                <summary aria-label={strings.ingredients.sortByNameLabel}><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label={strings.ingredients.nameSortMenuLabel}>
                  <button type="button" onClick={() => onSortChange("name-asc")}>{nameSortLabels[0]}</button>
                  <button type="button" onClick={() => onSortChange("name-desc")}>{nameSortLabels[1]}</button>
                </div>
              </details>
            </th>
            <th scope="col">{strings.ingredients.quantityHeader}</th>
            <th scope="col" className="ingredient-sort-heading">
              <span>{strings.ingredients.lastUpdatedHeader}</span>
              <details className="ingredient-sort">
                <summary aria-label={strings.ingredients.sortByLastUpdatedLabel}><span className="ingredient-sort-icon" aria-hidden="true"></span></summary>
                <div className="ingredient-sort-menu" aria-label={strings.ingredients.lastUpdatedSortMenuLabel}>
                  <button type="button" onClick={() => onSortChange("updated-desc")}>{updatedSortLabels[0]}</button>
                  <button type="button" onClick={() => onSortChange("updated-asc")}>{updatedSortLabels[1]}</button>
                </div>
              </details>
            </th>
            <th scope="col">{strings.ingredients.actionsHeader}</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="4">{strings.ingredients.emptyCategoryMessage}</td>
            </tr>
          ) : records.map((record) => (
            <tr key={record.name}>
              <td>{record.name}</td>
              <td>{record.quantity}</td>
              <td>
                {record.updatedAt
                  ? <time dateTime={record.updatedAt}>{record.updatedAt}</time>
                  : strings.ingredients.dateUnavailable}
              </td>
              <td className="ingredient-actions">
                <button className="btn" type="button" onClick={() => onEdit(record)}>{strings.ingredients.editButton}</button>
                <button className="btn" type="button" onClick={() => onDelete(record.name)}>{strings.ingredients.deleteButton}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default function Ingredients() {
  const [ingredients, setIngredients] = useState(() => getStorageItem(APP_STORAGE_KEYS.ingredients) ?? []);
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [editingName, setEditingName] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState(categories[0].value);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setStorageItem(APP_STORAGE_KEYS.ingredients, ingredients);
  }, [ingredients]);

  const sortedByCategory = useMemo(() => {
    const sorted = [...ingredients].sort((first, second) => {
      if (sortOrder.startsWith("name")) {
        const comparison = first.name.localeCompare(second.name);
        return sortOrder === "name-asc" ? comparison : -comparison;
      }

      const firstDate = first.updatedAt ?? "";
      const secondDate = second.updatedAt ?? "";
      const comparison = firstDate.localeCompare(secondDate);
      return sortOrder === "updated-asc" ? comparison : -comparison;
    });

    return Object.fromEntries(
      categories.map(({ value }) => [
        value,
        sorted.filter((ingredient) => ingredient.category === value),
      ]),
    );
  }, [ingredients, sortOrder]);

  const ingredientsNeedingRefresh = useMemo(
    () => ingredients
      .map((ingredient) => ({
        ...ingredient,
        daysSinceUpdated: getDaysSinceUpdated(ingredient.updatedAt),
      }))
      .filter((ingredient) => {
        const freshnessInterval = freshnessIntervals[ingredient.category];
        return freshnessInterval
          && ingredient.daysSinceUpdated !== null
          && ingredient.daysSinceUpdated >= freshnessInterval;
      })
      .sort((first, second) => second.daysSinceUpdated - first.daysSinceUpdated),
    [ingredients],
  );

  const resetForm = () => {
    setName("");
    setQuantity("");
    setCategory(categories[0].value);
    setEditingName(null);
    setFormError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedQuantity = quantity.trim();

    if (!trimmedName || !trimmedQuantity) {
      setFormError(strings.ingredients.requiredFieldsError);
      return;
    }

    const duplicate = ingredients.some((ingredient) =>
      ingredient.name.toLocaleLowerCase() === trimmedName.toLocaleLowerCase()
      && ingredient.name !== editingName,
    );
    if (duplicate) {
      setFormError(strings.ingredients.duplicateNameError);
      return;
    }

    const updatedIngredient = {
      name: trimmedName,
      quantity: trimmedQuantity,
      category,
      updatedAt: getToday(),
    };

    setIngredients((currentIngredients) => editingName
      ? currentIngredients.map((ingredient) => (
        ingredient.name === editingName ? updatedIngredient : ingredient
      ))
      : [...currentIngredients, updatedIngredient]);
    resetForm();
  };

  const handleEdit = (ingredient) => {
    setEditingName(ingredient.name);
    setName(ingredient.name);
    setQuantity(ingredient.quantity);
    setCategory(ingredient.category);
    setFormError("");
    document.getElementById("ingredient-name")?.focus();
  };

  const handleDelete = (ingredientName) => {
    setIngredients((currentIngredients) => currentIngredients.filter(
      (ingredient) => ingredient.name !== ingredientName,
    ));
    if (editingName === ingredientName) {
      resetForm();
    }
  };

  const handleMarkUpdated = (ingredientName) => {
    const updatedAt = getToday();
    setIngredients((currentIngredients) => currentIngredients.map((ingredient) => (
      ingredient.name === ingredientName ? { ...ingredient, updatedAt } : ingredient
    )));
  };

  return (
    <main>
      <h1>{strings.ingredients.pageTitle}</h1>
      <p>{strings.ingredients.signInNotice}</p>
      <section className="ingredient-reminders" aria-labelledby="ingredient-reminders-heading" aria-live="polite">
        <h2 id="ingredient-reminders-heading">{strings.ingredients.remindersHeading}</h2>
        <p>{strings.ingredients.remindersDescription}</p>
        {ingredientsNeedingRefresh.length > 0 ? (
          <ul>
            {ingredientsNeedingRefresh.map((ingredient) => (
              <li key={ingredient.name}>
                <span>
                  {strings.ingredients.reminderMessage(
                    ingredient.name,
                    ingredient.daysSinceUpdated,
                    freshnessIntervals[ingredient.category],
                  )}
                </span>
                <button
                  className="btn"
                  type="button"
                  onClick={() => handleMarkUpdated(ingredient.name)}
                >
                  {strings.ingredients.markUpdatedButton}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p role="status">{strings.ingredients.noRemindersMessage}</p>
        )}
      </section>
      <form className="ingredient-form" onSubmit={handleSubmit}>
        <h2>{editingName ? strings.ingredients.editHeading : strings.ingredients.addHeading}</h2>
        <div className="ingredient-form-fields">
          <div>
            <label htmlFor="ingredient-name">{strings.ingredients.nameHeader}</label>
            <input
              className="form-control"
              id="ingredient-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="ingredient-quantity">{strings.ingredients.quantityHeader}</label>
            <input
              className="form-control"
              id="ingredient-quantity"
              name="quantity"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="ingredient-category">{strings.ingredients.categoryLabel}</label>
            <select
              className="form-control"
              id="ingredient-category"
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ingredient-form-actions">
          <button className="btn" type="submit">
            {editingName ? strings.ingredients.saveButton : strings.ingredients.addButton}
          </button>
          {editingName && (
            <button className="btn" type="button" onClick={resetForm}>
              {strings.ingredients.cancelButton}
            </button>
          )}
        </div>
        {formError && <p className="ingredient-form-error" role="alert">{formError}</p>}
      </form>
      {categories.map(({ value, label }) => (
        <IngredientTable
          key={value}
          headingId={`${value}-heading`}
          title={label}
          records={sortedByCategory[value]}
          onSortChange={setSortOrder}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </main>
  );
}
