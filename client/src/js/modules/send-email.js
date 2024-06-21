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

async function sendMail() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("msg").value;
  if (validateForm()) {
    await fetch("http://localhost:8080/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        msg: msg,
      }),
    });
  }
}

export { sendMail, validateForm };
