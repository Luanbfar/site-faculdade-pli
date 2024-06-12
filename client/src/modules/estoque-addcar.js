import { formatNumberBR } from "./car-management.js";
import { buyCar } from "./car-management.js";

function createCard(id, name, price) {
  const colDiv = document.createElement("div");
  colDiv.className = "col";

  const cardDiv = document.createElement("div");
  cardDiv.className = "card shadow bg-black rounded-0";
  cardDiv.id = id;

  const img = document.createElement("img");
  img.src = "../public/images/carro1.webp";
  img.className = "card-img-top rounded-0";
  img.alt = name;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardText = document.createElement("p");
  cardText.className = "card-text text-danger";
  cardText.innerText = name;

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title text-white";
  cardTitle.innerText = "R$ " + formatNumberBR(price.toLocaleString("pt-BR"));

  const button = document.createElement("button");
  button.type = "button";
  button.onclick = function () {
    buyCar(id);
  };
  button.className = "btn btn-danger rounded-0";
  button.innerText = "Comprar";

  cardBody.appendChild(cardText);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(button);

  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBody);

  colDiv.appendChild(cardDiv);

  return colDiv;
}

function addCardToContainer(containerId, id, name, price) {
  const container = document.getElementById(containerId);
  const card = createCard(id, name, price);
  container.appendChild(card);
}

const containerId = "row-carros";

async function showCars() {
  const response = await fetch("http://localhost:8080/api/cars");
  const cars = await response.json();
  cars.forEach((car) => {
    let id = car.id;
    let name = car.name;
    let price = car.price;
    addCardToContainer(containerId, id, name, price);
  });
}

export { showCars };
