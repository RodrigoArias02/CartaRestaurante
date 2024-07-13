import fs from "fs";
import __dirname from "../../utils.js";
import { join } from "path";
export class menuManager {
  constructor(ruta) {
    this.path = ruta;
  }

  getItems() {
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

  getProduct(idTitle,idProduct){

    const items = this.getItems()

    const objetoEncontrado = items.find(objeto => objeto.id == idTitle);

    const productoEncontrado = objetoEncontrado.platos.find(objeto => objeto.id == idProduct);
 
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
        const imagePath = join(__dirname, 'public', productoEncontrado.image);
        if (!fs.existsSync(imagePath)) {
          productoEncontrado.image = '';
        }
      }
    } else {
      productoEncontrado.image = '';
    }

 
    return productoEncontrado
}
}
