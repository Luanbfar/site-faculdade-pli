import {
  fetchCars,
  addCar,
  editCar,
  deleteCar,
  fetchPurchases,
} from "./modules/car-management.js";
import { showCars } from "./modules/estoque-addcar.js";
import { animateCards, animateContent } from "./modules/anime.min.js";
import { sendMail, validateForm } from "./modules/send-email.js";
const windowURL = window.location.pathname;

window.fetchCars = fetchCars;
window.addCar = addCar;
window.editCar = editCar;
window.deleteCar = deleteCar;
window.showCars = showCars;
window.fetchPurchases = fetchPurchases;
window.animateCards = animateCards;
window.animateContent = animateContent;

document.addEventListener("DOMContentLoaded", () => {
  switch (windowURL) {
    case "/car-management.html":
      const carForm = document.getElementById("car-form");
      if (carForm) {
        document.getElementById("car-form").addEventListener("submit", addCar);
        fetchCars();
        fetchPurchases();
      }
      const popupBox = document.getElementById("popup-box");
      const openPopUp = document.getElementById("open-popup");

      openPopUp.addEventListener("click", () => {
        popupBox.style.display = "flex";
      });
      window.addEventListener("click", (e) => {
        if (e.target === popupBox) {
          popupBox.style.display = "none";
        }
      });

      const btn1 = document.getElementById("btn-stock");
      const btn2 = document.getElementById("btn-purchases");
      const containerStock = document.querySelector(".container-stock");
      const containerPurchases = document.querySelector(".container-purchases");

      btn1.addEventListener("click", () => {
        containerStock.classList.remove("hidden");
        containerPurchases.classList.add("hidden");
        btn1.classList.add("active");
        btn2.classList.remove("active");
      });
      btn2.addEventListener("click", () => {
        containerStock.classList.add("hidden");
        containerPurchases.classList.remove("hidden");
        btn1.classList.remove("active");
        btn2.classList.add("active");
      });
      break;
    case "/estoque.html":
      showCars();
      document.dispatchEvent(new Event("cardsAdded"));
      document.addEventListener("scroll", animateCards);
      break;
    case "/index.html":
    case "/":
      document.addEventListener("scroll", animateContent);
      break;
    case "/contato.html":
      const contactForm = document.getElementById("contact-form");
      const btn = document.getElementById("submit-btn");
      contactForm.addEventListener("input", () => {
        if (validateForm()) {
          btn.disabled = false;
        } else {
          btn.disabled = true;
        }
      });
      contactForm.addEventListener("submit", sendMail);
      break;
    case "/login.html":
      const loginForm = document.getElementById("login-form");
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (email === "email@example.com" && password === "12345") {
          window.location.pathname = "/car-management.html";
        } else {
          console.log("Acesso negado");
        }
      });
      break;
    default:
      document.write("Página não encontrada");
      break;
  }
});

console.log("Script loaded");
