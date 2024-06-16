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

  if (cars.length === 0) {
    const noCars = document.createElement("div");
    noCars.className =
      "container mt-5 d-flex justify-content-center align-items-center text-light";
    noCars.innerHTML = "Sem carros";
    carsDiv.appendChild(noCars);
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-striped table-hover text-light";

  const thead = document.createElement("thead");
  thead.className = "table-dark";
  thead.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Preço</th>
      <th>Quantidade</th>
      <th>Ações</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  cars.forEach((car) => {
    const editBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg>`;

    const deleteBtnIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;

    const carRow = document.createElement("tr");
    carRow.id = car.id;
    carRow.innerHTML = `
      <td>${car.name}</td>
      <td>R$${formatNumberBR(car.price)}</td>
      <td>${car.quantity}</td>
      <td>
        <button class="btn btn-secondary me-2" onclick="editCar(${car.id}, '${
      car.name
    }', ${car.price}, ${car.quantity})">${editBtnIcon}</button>
        <button class="btn btn-danger" onclick="deleteCar(${
          car.id
        })">${deleteBtnIcon}</button>
      </td>
    `;
    tbody.appendChild(carRow);
  });

  table.appendChild(tbody);
  carsDiv.appendChild(table);
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

async function buyCar(id, name, price) {
  if (id && name && price) {
    try {
      const decrementStockResponse = await fetch(`http://localhost:8080/api/cars/buy/${id}`, {
        method: "PUT",
      });

      if (!decrementStockResponse.ok) {
        throw new Error(`Failed to decrement stock: ${decrementStockResponse.statusText}`);
      }

      const addPurchaseResponse = await fetch(`http://localhost:8080/api/cars/buy/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          car_name: name,
          price: price,
        })
      });

      if (!addPurchaseResponse.ok) {
        throw new Error(`Failed to add purchase: ${addPurchaseResponse.statusText}`);
      }

    } catch (error) {
      console.error("Erro ao comprar carro: ", error);
    }
  } else {
    console.error("Invalid values");
  }
}



export { fetchCars, addCar, editCar, deleteCar, buyCar, formatNumberBR };
