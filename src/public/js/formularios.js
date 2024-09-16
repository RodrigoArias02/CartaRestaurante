// JavaScript
let contenedorFormulario = document.querySelectorAll(".contenedor-inputs");
let btn = document.querySelectorAll(".btn_opcion");
let btnFormulario = document.querySelectorAll(".btn-formulario");

btn.forEach((boton) => {
  boton.addEventListener("click", () => {
    const atributo = boton.getAttribute("data-id").trim();
    contenedorFormulario.forEach((contenedor) => {
      if (contenedor.getAttribute("data-id").trim() === atributo) {
        if (contenedor.classList.contains("hidden")) {
          contenedor.classList.remove("hidden");
        }
      } else {
        contenedor.classList.add("hidden");
      }
    });
  });
});
btnFormulario.forEach((boton, index) => {
  boton.addEventListener("click", async () => {
    let ruta;
    let metodo;
    let status = 200;
    // Accede a los inputs del contenedor actual de manera segura
    const nombreInput = document.querySelectorAll("input[name='nombre']")[
      index
    ];
    const descripcionInput = document.querySelectorAll(
      "textarea[name='descripcion']"
    )[index];
    const precioInput = document.querySelectorAll("input[name='precio']")[
      index
    ];
    const fotoInput = document.querySelectorAll("input[name='img']")[index];
    const selectores = document.querySelectorAll("select[name='selectores']")[
      index
    ];

    // Verifica si los elementos existen antes de acceder a sus valores
    const nombre = nombreInput ? nombreInput.value : null;
    const descripcion = descripcionInput ? descripcionInput.value : null;
    const precio = precioInput ? precioInput.value : null;
    const selectorValue = selectores ? selectores.value : null;

    const file = fotoInput ? fotoInput.files[0] : null;

    const formData = new FormData();

    // Agrupar todas las variables en un array
    const fields = [nombre, descripcion, precio, selectorValue];

    const valor = fields.some(
      (field) =>
        field == null || (typeof field === "string" && field.trim() === "")
    );
    // Verificar si alguna de las variables es null, undefined, o una cadena vacía
    if (valor && index < 2) {
      alert("Complete los campos");
      return;
    }

    if (file != null || file != undefined) {
      const formatoImg = file.type.split("/");

      const formatosPermitidos = ["png", "jpg", "webp", "jpeg"]; // Asegúrate de usar el formato correcto, por ejemplo "jpeg" en lugar de "jpge"

      // Verifica si el formato de imagen está en la lista de formatos permitidos
      if (!formatosPermitidos.includes(formatoImg[1])) {
        alert("formato no permitido");
        return;
      }
    }

    // Agregar otros datos al FormData
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", precio);
    formData.append("categoriaSelecc", selectorValue);
    formData.append("image", file); // 'image' es el nombre del campo que Multer espera

    const atributo = boton.getAttribute("data-id").trim();
    if (atributo == "btn-subir") {
      ruta = "subirElemento";
      metodo = "POST";
      status = 201;
      console.log("post");
    } else if (atributo == "btn-actualizacion") {
      ruta = `actualizarElemento/${selectorValue}`;
      metodo = "PUT";
      status = 200;
    } else if (atributo == "btn-eliminar") {
      ruta = `eliminarElemento/${selectorValue}`;
      metodo = "DELETE";
      status = 200;
    } else {
      ruta = "no";
    }
    try {
      // Enviar datos al servidor y esperar la respuesta
      const response = await fetch(`/${ruta}`, {
        method: metodo,
        body: formData, // Enviar formData directamente
      });

      // Parsear la respuesta como JSON
      const data = await response.json();

      if (data.status === status) {
        const gola = await RecargarPlatos();
        console.log(gola);
        nombreInput.value = "";
        descripcionInput.value = "";
        precioInput.value = "";
        fotoInput.value = "";
        alert("Subidpo con exito");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const funcion = await RecargarPlatos();
});

async function RecargarPlatos() {
  try {
    // Enviar datos al servidor y esperar la respuesta
    const response = await fetch(`/obtenerPlatos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Parsear la respuesta como JSON
    const data = await response.json();

    if (data.status === 200) {
      const platos = data.platos;
      // Puedes rellenar el select aquí si es necesario
      const selector = document.getElementById("selector_id");
      // Selecciona todos los <select> con el mismo nombre
      const selects = document.querySelectorAll(
        'select[class="selector_platos"]'
      );

      // Itera sobre cada <select>
      selects.forEach((select) => {
        // Limpia las opciones anteriores
        select.innerHTML = '<option value="">Elija un elemento</option>';

        // Recorre el array de platos y agrega cada uno como una opción en el <select>
        platos.forEach((plato) => {
          const option = document.createElement("option");
          option.value = plato.id;
          option.textContent = `${plato.nombre} (${plato.categoria})`;
          select.appendChild(option);
        });
      });
      selector.addEventListener("change", async () => {
        const inputNombre = document.getElementsByName("nombre")[1];
        const inputDescripcion = document.getElementsByName("descripcion")[1];
        const inputPrecio = document.getElementsByName("precio")[1];
        if (selector.value != "") {
          const selectedValue = selector.value;

          let plato = platos.find((plato) => plato.id === selectedValue);
          console.log(plato);
          const { nombre, precio, descripcion, image } = plato;

          inputNombre.value = nombre;
          inputDescripcion.value = descripcion;
          inputPrecio.value = precio;
          imagenAnterior.value = image;
        } else {
          inputNombre.value = "";
          inputDescripcion.value = "";
          inputPrecio.value = "";
        }
      });
    } else {
      alert(data.error);
      return data.error;
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    return error;
  }
}
