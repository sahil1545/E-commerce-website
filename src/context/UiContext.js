import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const useUI = () => useContext(UIContext);

export function UIProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [alert, setAlert] = useState(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <UIContext.Provider
      value={{ theme, toggleTheme, alert, showAlert }}
    >
      {children}
    </UIContext.Provider>
  );
}
