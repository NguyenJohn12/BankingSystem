/* main.js: JavaScript to interact with the banking system interface */

document.addEventListener("DOMContentLoaded", function() {
  console.log("main.js loaded");

  // Fade-in effect for elements with the class 'container'
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = 0;
    container.style.transition = "opacity 1.5s ease-in-out";
    setTimeout(function() {
      container.style.opacity = 1;
    }, 200);
  }

  // Smooth scrolling for in-page anchor links (optional)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetID = this.getAttribute("href");
      const targetElement = document.querySelector(targetID);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // Login form simulation (only for the login page)
  const loginForm = document.querySelector("form");
  if (loginForm && loginForm.action.includes("main.html")) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("username");
      const password = document.getElementById("password");
      if (username.value.trim() !== "" && password.value.trim() !== "") {
        alert("Logging in...");
        window.location.href = "main.html";
      } else {
        alert("Please enter both username and password.");
      }
    });
  }
});
