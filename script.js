import { fetchCars, addCar, editCar, deleteCar } from "./modules/car-crud.js";
import { showCars } from "./modules/estoque-addcar.js";
import { animateCards } from "./modules/anime.min.js";

const windowURL = window.location.pathname;

window.fetchCars = fetchCars;
window.addCar = addCar;
window.editCar = editCar;
window.deleteCar = deleteCar;
window.showCars = showCars;
window.animateCards = animateCards;

document.addEventListener("DOMContentLoaded", () => {
  if (windowURL === "/car-inventory.html") {
    const carForm = document.getElementById("car-form");
    if (carForm) {
      document.getElementById("car-form").addEventListener("submit", addCar);
      fetchCars();
    }
  }

  if (windowURL === "/estoque.html") {
    showCars();
    document.dispatchEvent(new Event("cardsAdded"));
    document.addEventListener("scroll", animateCards);
  }

  if (windowURL === "/index.html") {
    document.addEventListener("scroll", animateCards);
  }
});
