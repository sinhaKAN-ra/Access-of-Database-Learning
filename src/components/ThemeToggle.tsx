import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      type="button"
      aria-label="Toggle Dark Mode"
      className="p-2 border w-full md:border-none rounded-md hover:bg-muted transition-colors flex justify-center items-center gap-4"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      <p className="md:hidden">Toggle {dark ? "light" : "dark"} mode</p>
    </button>
  );
};

export default ThemeToggle;
