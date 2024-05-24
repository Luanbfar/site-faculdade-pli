document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const handleScroll = () => {
    cards.forEach((card) => {
      if (isElementInViewport(card)) {
        card.classList.add("slide-in-left");
      }
    });
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleScroll);
});

var carrosDisponiveis = {
  carro1: {
    nome: "Bacalar",
    valor: 1800000,
    quantidade: 10,
  },
  carro2: {
    nome: "Gordon",
    valor: 1400000,
    quantidade: 10,
  },
  carro3: {
    nome: "McLaren",
    valor: 4800000,
    quantidade: 10,
  },
  carro4: {
    nome: "De Tomaso",
    valor: 3467840,
    quantidade: 10,
  },
  carro5: {
    nome: "Czinger",
    valor: 1800000,
    quantidade: 10,
  },
  carro6: {
    nome: "Ferrari",
    valor: 3800000,
    quantidade: 10,
  },
  carro7: {
    nome: "Monza",
    valor: 6000000,
    quantidade: 10,
  },
  carro8: {
    nome: "Venom",
    valor: 1566421,
    quantidade: 10,
  },
  carro9: {
    nome: "Drako",
    valor: 2900000,
    quantidade: 10,
  },
  carro10: {
    nome: "Koeniggseg",
    valor: 1800000,
    quantidade: 10,
  },
  carro11: {
    nome: "Pagani",
    valor: 3670000,
    quantidade: 10,
  },
  carro12: {
    nome: "Zenvo",
    valor: 5230000,
    quantidade: 10,
  },
};

var carrosComprados = [];

function comprarCarro(carro) {
  mudarEstiloCard(carro);
  let carroAtual = carrosDisponiveis[carro];
  if (carroAtual.quantidade === 0) {
    console.log("Desculpe, este carro não está mais disponível.");
    return false;
  } else {
    const clonarCarro = (carro) => ({
      nome: carro.nome,
      valor: carro.valor,
      quantidade: carro.quantidade,
    });
    const carroComprado = clonarCarro(carroAtual);
    carroAtual.quantidade--;
    carrosComprados.push(carroComprado);
    console.clear();
    console.table(carrosComprados);
  }
  return true;
}

function mudarEstiloCard(carroId) {
  let carro = carrosDisponiveis[carroId];
  if (carro.quantidade === 0) {
    document.getElementById(carroId + "-img").style.filter = "grayscale(100%)";
    document.getElementById(carroId + "-btn").disabled = true;
  }
}
