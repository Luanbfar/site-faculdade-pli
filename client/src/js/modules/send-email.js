function appendAlert(message, type) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible mt-3" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    "</div>",
  ].join("");

  alertPlaceholder.append(wrapper);
}

function validateForm() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("msg").value;
  if (name && email && msg) {
    return true;
  } else {
    return false;
  }
}

async function sendMail(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("msg").value;
  if (validateForm()) {
    appendAlert("E-mail enviado com sucesso!", "success");
    try {
      await fetch("http://localhost:8080/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          msg: msg,
        }),
      });
    } catch (error) {
      console.error(`Não foi possível enviar o formulário.\n${error}`);
    }
  }
}

export { sendMail, validateForm };
