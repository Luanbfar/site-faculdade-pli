function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function fetchCars() {
  const response = await fetch("http://localhost:3000/api/cars");
  const cars = await response.json();
  const carsDiv = document.getElementById("cars");
  carsDiv.innerHTML = "";
  cars.forEach((car) => {
    const carElement = document.createElement("div");
    carElement.className =
      "container mt-5 p-1 d-flex justify-content-center align-items-center";
    carElement.innerHTML = `
          <p class="text-light me-3">${car.name} - R$${numberWithCommas(
      car.price
    )} - Quantidade: ${car.quantity}</p>
          <button class="btn btn-secondary me-2" onclick="editCar(${car.id}, '${
      car.name
    }', ${car.price}, ${car.quantity})">Editar</button>
          <button class="btn btn-danger" onclick="deleteCar(${
            car.id
          })">Deletar</button>
      `;
    carsDiv.appendChild(carElement);
  });
}

async function addCar(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;
  await fetch("http://localhost:3000/api/cars", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, quantity }),
  });
  fetchCars();
}

async function editCar(id, name, price, quantity) {
  const newName = prompt("Insira o novo nome", name);
  const newPrice = prompt("Insira o novo preço", price);
  const newQuantity = prompt("Insira a nova quantidade", quantity);
  if (newName === null || newPrice === null || newQuantity === null) {
    alert("Valores não podem ser nulos");
  } else if (
    newName.length == 0 ||
    newPrice.length == 0 ||
    newQuantity.length == 0
  ) {
    alert("Valores não podem ser nulos");
  } else {
    await fetch(`http://localhost:3000/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        price: newPrice,
        quantity: newQuantity,
      }),
    });
    fetchCars();
  }
}

async function deleteCar(id) {
  await fetch(`http://localhost:3000/api/cars/${id}`, { method: "DELETE" });
  fetchCars();
}

document.getElementById("car-form").addEventListener("submit", addCar);
fetchCars();
