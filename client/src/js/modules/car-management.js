function formatNumberBR(x) {
  x = Number(x);
  let parts = x.toFixed(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.join(",");
}

function createHTMLElement(tagName, className, innerHTML) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}

function createCarsTable(cars) {
  const table = createHTMLElement("table", "table table-striped table-hover text-light");

  const thead = createHTMLElement("thead", "table-dark");
  const headers = ["Nome", "Preço", "Quantidade", "Ações"];
  thead.innerHTML = `
    <tr>
      ${headers.map(header => `<th>${header}</th>`).join("")}
    </tr>
  `;
  table.appendChild(thead);

  const tbody = createHTMLElement("tbody", "");
  cars.forEach(car => {
    const editBtnIcon = "<img src='./public/assets/pen.svg'>";

    const deleteBtnIcon = "<img src='./public/assets/trash.svg'>";

    const rowContent = [
      `<td>${car.name}</td>`,
      `<td>R$${formatNumberBR(car.price)}</td>`,
      `<td>${car.quantity}</td>`,
      `<td>
         <button class="btn btn-secondary me-2" onclick="editCar(${car.id}, '${car.name}', ${car.price}, ${car.quantity})">${editBtnIcon}</button>
         <button class="btn btn-danger" onclick="deleteCar(${car.id})">${deleteBtnIcon}</button>
       </td>`
    ];

    const carRow = createHTMLElement("tr", "", rowContent.join(""));
    tbody.appendChild(carRow);
  });

  table.appendChild(tbody);
  return table;
}

function displayCars(cars) {
  const carsDiv = document.getElementById("cars");
  carsDiv.innerHTML = "";

  if (cars.length === 0) {
    displayNoCarsMessage(carsDiv);
    return;
  }

  const table = createCarsTable(cars);
  carsDiv.appendChild(table);
}

function displayNoCarsMessage(container) {
  const noCars = createHTMLElement("div", "container mt-5 d-flex justify-content-center align-items-center text-light", "Sem carros");
  container.appendChild(noCars);
}

async function fetchCars() {
  try {
    const cars = await getCars();
    displayCars(cars);
  } catch (error) {
    handleFetchError(error);
  }
}

async function getCars() {
  const response = await fetch("http://localhost:8080/api/cars");
  if (!response.ok) {
    throw new Error("Erro ao obter dados dos carros");
  }
  return await response.json();
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
      const decrementStockResponse = await fetch(
        `http://localhost:8080/api/purchases/buy/${id}`,
        {
          method: "PUT",
        }
      );

      if (!decrementStockResponse.ok) {
        throw new Error(
          `Failed to decrement stock: ${decrementStockResponse.statusText}`
        );
      }

      const addPurchaseResponse = await fetch(
        `http://localhost:8080/api/purchases/buy/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            car_name: name,
            price: price,
          }),
        }
      );

      if (!addPurchaseResponse.ok) {
        throw new Error(
          `Failed to add purchase: ${addPurchaseResponse.statusText}`
        );
      }
    } catch (error) {
      console.error("Erro ao comprar carro: ", error);
    }
  } else {
    console.error("Invalid values");
  }
}

async function fetchPurchases() {
  try {
    const purchases = await getPurchases();
    displayPurchases(purchases);
  } catch (error) {
    handleFetchError(error);
  }
}

async function getPurchases() {
  const response = await fetch("http://localhost:8080/api/purchases");
  if (!response.ok) {
    throw new Error("Erro ao obter dados das compras");
  }
  return await response.json();
}

function displayPurchases(purchases) {
  const purchasesDiv = document.getElementById("purchases");
  purchasesDiv.innerHTML = "";

  if (purchases.length === 0) {
    const noPurchases = createHTMLElement("div", "container mt-5 d-flex justify-content-center align-items-center text-light", "Sem vendas");
    purchasesDiv.appendChild(noPurchases);
    return;
  }

  const table = document.createElement("table");
  table.className = "table table-striped table-hover text-light";

  const thead = document.createElement("thead");
  thead.className = "table-dark";
  thead.innerHTML = `
    <tr>
      <th>Id da compra</th>
      <th>Nome do carro</th>
      <th>Preço</th>
      <th>Horário da compra</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  purchases.forEach((purchase) => {
    const purchaseRow = document.createElement("tr");
    purchaseRow.innerHTML = `
      <td>${purchase.id_purchase}</td>
      <td>${purchase.car_name}</td>
      <td>R$${formatNumberBR(purchase.price)}</td>
      <td>${purchase.datetime}</td>
    `;
    tbody.appendChild(purchaseRow);
  });

  table.appendChild(tbody);
  purchasesDiv.appendChild(table);
}

function handleFetchError(error) {
  console.error("Erro na requisição:", error);
}

export {
  fetchCars,
  addCar,
  editCar,
  deleteCar,
  buyCar,
  fetchPurchases,
  formatNumberBR,
};
