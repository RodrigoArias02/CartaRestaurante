let h4 = document.getElementById("titulo");
let texto = document.getElementById("text");
let imagen = document.getElementById("img");
let modal = document.querySelector(".contenedor-modal");
function mover() {

  modal.classList.toggle('show');
}

document.getElementById("btn").addEventListener("click", function () {
  mover();
});
document.addEventListener("DOMContentLoaded", () => {
  const nombres = document.querySelectorAll(".nombre-plato");

  nombres.forEach((nombre) => {
    nombre.addEventListener("click", async () => {
      let nombreId = nombre.getAttribute("data-id").trim();

      // Buscar el elemento "parte2" más cercano
      const parte2 = nombre.closest(".parte2");

      // Buscar el elemento "p" con la clase "platos" dentro del elemento "parte2"
      if (parte2) {
        const platos = parte2.querySelector(".seccion");
        if (platos) {
          let platoId = platos.getAttribute("data-id").trim();

          try {
            const response = await fetch(`/${platoId}/${nombreId}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data.status == 200) {
              mover();
              h4.innerHTML = data.product.nombre;
              texto.innerHTML = data.product.descripcion;
              console.log(data.product)
              if (data.product.image != "") {
                imagen.src = `/image/${data.product.image}`;
              } else {
                imagen.src =
                  "https://yaskawa-pillar.mx/img/categorias/no-disponible.jpg";
              }
            }
          } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error al guardar. Por favor, inténtelo de nuevo más tarde.");
          }
        } else {
          console.log('No se encontró un elemento con la clase "seccion"');
        }
      } else {
        console.log('No se encontró un elemento con la clase "parte2"');
      }
    });
  });
});
