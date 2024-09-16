import fs from "fs";
import __dirname from "../../utils.js";
import { join } from "path";
export class menuManager {
  constructor(ruta) {
    this.path = ruta;
  }

  async getItems() {
    if (fs.existsSync(this.path)) {
      try {
        const data = fs.readFileSync(this.path, "utf8");

        return JSON.parse(data);
      } catch (error) {
        console.error("Error reading file:", error);
        return [];
      }
    } else {
      return [];
    }
  }
  async getProduct(idTitle, idProduct) {
    const items = await this.getItems();

    const objetoEncontrado = items.find((objeto) => objeto.id == idTitle);

    const productoEncontrado = objetoEncontrado.platos.find(
      (objeto) => objeto.id == idProduct
    );

    if (productoEncontrado.image) {
      // Verifica si es una URL o una ruta local
      const isUrl = (string) => {
        try {
          new URL(string);
          return true;
        } catch (_) {
          return false;
        }
      };

      if (!isUrl(productoEncontrado.image)) {
        // Verifica si la imagen existe en la carpeta 'public/image'
        const imagePath = join(__dirname, "public", productoEncontrado.image);
        if (!fs.existsSync(imagePath)) {
          productoEncontrado.image = "";
        }
      }
    } else {
      productoEncontrado.image = "";
    }

    return productoEncontrado;
  }
  async getDish(idDish) {
    const items = await this.getItems();
    console.log(idDish)
    for (const item of items) {
      const platoEncontrado = item.platos.find((plato) => plato.id === idDish);
      if (platoEncontrado) {
        const category = item.id;
        return { platoEncontrado, category };
      }
    }
    return null;
  }
  async getPlatos() {
    try {
      const items = await this.getItems();
      // Usar reduce para combinar todos los arrays de platos en uno solo
      const allPlatos = items.reduce((accumulator, item) => {
        return accumulator.concat(item.platos);
      }, []);

      return allPlatos;
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }
  async saveDish(idCategory, objectDish) {
    try {
      let items = await this.getItems();

      //buscamos la seccion
      let objetoEncontrado = items.find((objeto) => objeto.id == idCategory);
      //hacemos el push(automaticamente se guarda en la categoria y en el array item se modifica)
      objetoEncontrado.platos.push(objectDish);

      const contenidoString = JSON.stringify(items, null, 2);

      console.log(contenidoString);

      return this.grabar(contenidoString);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  async updateDish(idDish, dishObject) {
    try {
      console.log(idDish);
      let items = await this.getItems();
      let category;
      for (const item of items) {
        const platoEncontrado = item.platos.find(
          (plato) => plato.id === idDish
        );
        if (platoEncontrado) {
          category = item.id;
        }
      }

      //buscamos la seccion
      let objetoEncontrado = items.find((objeto) => objeto.id == category);
      //hacemos el push(automaticamente se guarda en la categoria y en el array item se modifica)
      objetoEncontrado.platos.push(dishObject);

      let contenidoString = JSON.stringify(items, null, 2);

      for (const item of items) {
        const index = item.platos.findIndex((plato) => plato.id === idDish);
        if (index !== -1) {
          // Elimina el plato del array de platos
          item.platos.splice(index, 1);

          contenidoString = JSON.stringify(items, null, 2);
        }
      }
      this.grabar(contenidoString);
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  async deleteDish(idDish) {
    try {
      const items = await this.getItems();
      for (const item of items) {
        const index = item.platos.findIndex((plato) => plato.id === idDish);
        if (index !== -1) {
          // Elimina el plato del array de platos
          item.platos.splice(index, 1);

          const contenidoString = JSON.stringify(items, null, 2);

          return this.grabar(contenidoString);
        }
      }
      return false; // Si no se encuentra el plato
    } catch (error) {
      return error;
    }
  }

  async grabar(contenidoString) {
    fs.writeFile(this.path, contenidoString, (err) => {
      if (err) {
        console.error("Error al escribir en el archivo:", err);
        return;
      }
      console.log("El archivo ha sido reescrito exitosamente.");

      return {
        status: 201,
        mesagge: "El archivo ha sido reescrito exitosamente",
      };
    });
  }
}
