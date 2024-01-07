let h4 = document.getElementById("titulo")
let texto = document.getElementById("text")
let imagen = document.getElementById("img")
console.log("scrp")
function mover(){
    document.querySelector(".contenedor-modal").style.transform = "translate(0%)";
}

document.getElementById("btn").addEventListener("click", function() {
    document.querySelector(".contenedor-modal").style.transform = "translate(-100%)";
   
});

// Obtén todos los elementos que tienen la clase 'precio-plato'
let elementosPrecioPlato = document.querySelectorAll(".precio-plato .nombre");
// Itera sobre cada elemento y agrega un evento de clic
elementosPrecioPlato.forEach(function (elemento) {
  elemento.addEventListener("click", function () {
    // Obtiene el título del plato haciendo referencia al elemento padre
    let cosa = document.querySelectorAll(".nombre")
    cosa.forEach(function (valor) {
      valor.addEventListener("click", function () {
        console.log(valor.textContent);
        mover()
        h4.innerHTML =valor.textContent;
        texto.innerHTML = "    Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit enim animi beatae sequi amet ipsa praesentium ";
        imagen.src="imagenes/peces.jpg";
      
      });
    });
  });
});

