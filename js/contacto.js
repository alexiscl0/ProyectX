document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formContacto");
  const mensaje = document.getElementById("mensajeEnviado");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    mensaje.style.display = "block";
    form.reset();
  });

  form.addEventListener("input", () => {
    mensaje.style.display = "none";
  });

});
