function formatNumberBR(x) {
  x = Number(x);
  let parts = x.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

async function fetchCars() {
  const response = await fetch("http://localhost:8080/api/cars");
  const cars = await response.json();
  const carsDiv = document.getElementById("cars");
  carsDiv.innerHTML = "";
  if (cars.length == 0) {
    const noCars = document.createElement("div");
    noCars.className =
      "container mt-5 d-flex justify-content-center align-items-center text-light";
    noCars.innerHTML = "Sem carros";
    carsDiv.appendChild(noCars);
  }
  cars.forEach((car) => {
    const carElement = document.createElement("div");
    carElement.id = car.id;
    carElement.className =
      "container mt-5 p-1 d-flex justify-content-center align-items-center";
    carElement.innerHTML = `
          <p class="text-light me-3">${car.name} - R$${formatNumberBR(
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
  const rawName = document.getElementById("name").value;
  const name = rawName ? rawName.trim() : "";
  const price = Number(document.getElementById("price").value);
  const quantity = Number(document.getElementById("quantity").value);
  if (!name || !price || !quantity) {
    alert("Insira valores válidos");
  } else {
    await fetch("http://localhost:8080/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity }),
    });
  }
  fetchCars();
}

async function editCar(id, name, price, quantity) {
  const newName = prompt("Insira o novo nome", name);
  const trimmedNewName = newName ? newName.trim() : "";
  const newPrice = Number(prompt("Insira o novo preço", price));
  const newQuantity = Number(prompt("Insira a nova quantidade", quantity));
  if (!trimmedNewName || !newPrice || !newQuantity) {
    alert("Valores não podem ser nulos");
  } else {
    await fetch(`http://localhost:8080/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: trimmedNewName,
        price: newPrice,
        quantity: newQuantity,
      }),
    });
  }
  fetchCars();
}

async function deleteCar(id) {
  await fetch(`http://localhost:8080/api/cars/${id}`, { method: "DELETE" });
  fetchCars();
}

async function buyCar(id) {
  try {
    const response = await fetch(`http://localhost:8080/api/cars/buy/${id}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error(`Failed to buy car: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error("Erro ao comprar carro: ", error);
  }
}

export { fetchCars, addCar, editCar, deleteCar, buyCar, formatNumberBR };
