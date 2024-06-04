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

  const loginButton = document.getElementById("login-button");

  if (loginButton) {
    loginButton.addEventListener("click", function (event) {
      window.location.href = "index.html";
    });
  }
});
