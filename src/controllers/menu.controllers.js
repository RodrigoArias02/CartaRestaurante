import { menuManager } from "../backend/api/managerClassMenu.js";
import __dirname, { isBcryptHash } from "../utils.js";
import { join } from "path";
import { configVar } from "../config/config.env.js";
import { validPassword } from "../utils.js";
const menuMgr = new menuManager(
  join(__dirname, "backend", "archives", "products.json")
);

export class CartsControllers {
  static async renderMenu(req, res) {
    res.setHeader("Content-Type", "text/html");

    const items = menuMgr.getItems();
    return res.status(200).render("carta", { items });
  }
  static async renderLogin(req, res) {
    res.setHeader("Content-Type", "text/html");
    return res.status(200).render("login");
  }
  static async userLogueo(req, res) {
    res.setHeader("Content-Type", "application/json");
    let {user,password} = req.body;

    const userLogin={
      name:user
    }
    if(!isBcryptHash(configVar.PASSWORD)){
      return res.status(500).json({ status: 500, error: 'La contraseña registrada no esta codificada' });
    }
    if (configVar.USER !== user) {
      return res.status(401).json({ status: 401, error: 'Credenciales incorrectas uy' });
    }
    //primer parametro contraseña guardada en bd o persistencia y segunda contraseña del form
    if (!validPassword(configVar.PASSWORD, password )) {
      return res.status(401).json({ status: 401, error: 'Credenciales incorrectas' });

    }
   
    return res.status(201).json({
      status: 201,
      message: "Datos recibidos correctamente",
    })
  
  }

  static async menuId(req, res) {
    res.setHeader("Content-Type", "application/json");
    const idTitle = req.params.platoId;
    const idProduct = req.params.nombreId;

    const product = menuMgr.getProduct(idTitle, idProduct);

    if (product.img) {
    }
    res.status(200).json({
      status: 200,
      message: "Datos recibidos correctamente",
      product: product,
    });
  }
}
