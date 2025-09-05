// Select elements
const settingsBtn = document.getElementById("settings-btn");
const settingsOptions = document.querySelector(".settings-options");
const lightMode = document.getElementById("light-mode");
const darkMode = document.getElementById("dark-mode");

// Toggle settings dropdown
settingsBtn.addEventListener("click", (e) => {
  e.preventDefault(); 
  settingsOptions.style.display =
    settingsOptions.style.display === "block" ? "none" : "block";
});

// Function to set Light theme
function setLightTheme() {
  document.body.classList.remove("dark-theme-variables");
  lightMode.classList.add("active");
  darkMode.classList.remove("active");
}

// Function to set Dark theme
function setDarkTheme() {
  document.body.classList.add("dark-theme-variables");
  darkMode.classList.add("active");
  lightMode.classList.remove("active");
}

// Add event listeners for theme options
lightMode.addEventListener("click", setLightTheme);
darkMode.addEventListener("click", setDarkTheme);


