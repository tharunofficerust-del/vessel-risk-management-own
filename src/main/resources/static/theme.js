const themeButton =
    document.getElementById("themeToggle");


function applyTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

        themeButton.innerHTML =
            "☀️ Light Mode";

    }

    else {

        document.body.classList.remove("dark-mode");

        themeButton.innerHTML =
            "🌙 Dark Mode";

    }

}


themeButton.addEventListener("click", () => {

    const currentTheme =
        localStorage.getItem("theme") || "light";

    const newTheme =
        currentTheme === "light"
            ? "dark"
            : "light";

    localStorage.setItem(
        "theme",
        newTheme
    );

    applyTheme(newTheme);

});


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const savedTheme =
            localStorage.getItem("theme") || "light";

        applyTheme(savedTheme);

    }
);