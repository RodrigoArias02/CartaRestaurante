import { getCategoryNameById } from "../utils.js";
export class dishSaveDTO {
  constructor(dish) {
    let imagen = dish.filename;
    if (dish.image && !dish.filename) {
      imagen = dish.image;
    }
    this.nombre = dish.nombre || "";
    this.precio = Number(dish.precio) || 0;
    this.descripcion = dish.descripcion || "";
    this.image = imagen || "";
    this.id = dish.id || "";
    this.categoria = getCategoryNameById(dish.categoriaSelecc); // Usa la función para obtener el nombre de la categoría
  }
}
