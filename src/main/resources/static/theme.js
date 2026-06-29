const toggleButton = document.getElementById("themeToggle");

function applyTheme(theme) {

    document.body.classList.toggle(
        "dark-mode",
        theme === "dark"
    );

    toggleButton.textContent =
        theme === "dark"
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
}

toggleButton.addEventListener("click", () => {

    const currentTheme =
        localStorage.getItem("theme") || "light";

    const newTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

    localStorage.setItem("theme", newTheme);

    applyTheme(newTheme);
});

applyTheme(
    localStorage.getItem("theme") || "light"
);