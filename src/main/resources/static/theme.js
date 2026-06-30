const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.innerHTML = "☀️ Light Mode";
    } else {
        themeBtn.innerHTML = "🌙 Dark Mode";
    }

});