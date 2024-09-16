import { menuManager } from "../backend/api/managerClassMenu.js";
import __dirname, { isBcryptHash } from "../utils.js";
import { join } from "path";
import { dishSaveDTO } from "../pipe/dto.items.js";
import { configVar } from "../config/config.env.js";
import fs from "fs";
import { validPassword, generateToken, generateUniqueCode } from "../utils.js";
const menuMgr = new menuManager(
  join(__dirname, "backend", "archives", "products.json")
);

export class CartsControllers {
  static async renderMenu(req, res) {
    res.setHeader("Content-Type", "text/html");

    const items = await menuMgr.getItems();
    return res.status(200).render("carta", { items });
  }
  static async renderLogin(req, res) {
    res.setHeader("Content-Type", "text/html");
    const error = req.query.error;

    return res.status(200).render("login", { error });
  }
  static async renderAdmin(req, res) {
    res.setHeader("Content-Type", "text/html");

    const ids = await menuMgr.getItems();
    const platos = await menuMgr.getPlatos();

    return res.status(200).render("admin", { ids, platos });
  }
  static async obtenerPlatos(req, res) {
    res.setHeader("Content-Type", "application/json");

    const platos = await menuMgr.getPlatos();
    return res.status(200).json({
      status: 200,
      message: "Datos recibidos correctamente",
      platos,
    });
  }
  static async userLogueo(req, res) {
    res.setHeader("Content-Type", "application/json");
    let { user, password } = req.body;

    const userLogin = {
      user,
    };
    if (!isBcryptHash(configVar.PASSWORD)) {
      return res.status(500).json({
        status: 500,
        error: "La contraseña registrada no esta codificada",
      });
    }
    if (configVar.USER !== user) {
      return res
        .status(401)
        .json({ status: 401, error: "Credenciales incorrectas uy" });
    }
    //primer parametro contraseña guardada en bd o persistencia y segunda contraseña del form
    if (!validPassword(configVar.PASSWORD, password)) {
      return res
        .status(401)
        .json({ status: 401, error: "Credenciales incorrectas" });
    }

    const access_token = generateToken(userLogin);
    return res.status(201).json({
      status: 201,
      message: "Datos recibidos correctamente",
      access_token,
    });
  }
  static async verifyToken(req, res) {
    res.setHeader("Content-Type", "application/json");

    return res.status(201).json({
      status: 201,
      message: "Autoenticado con exito",
      payload: req.user,
    });
  }
  static async menuId(req, res) {
    res.setHeader("Content-Type", "application/json");
    const idTitle = req.params.platoId;
    const idProduct = req.params.nombreId;

    const { platoEncontrado } = await menuMgr.getDish(idProduct);

    res.status(200).json({
      status: 200,
      message: "Datos recibidos correctamente",
      product: platoEncontrado,
    });
  }

  static async subirArchivo(req, res, next) {
    try {
      res.setHeader("Content-Type", "application/json");
      const reference = req.file;
      const name = req.body;

      // Agregar un ID único si no está presente
      const id = generateUniqueCode();
      // Crear un nuevo objeto con los datos del cuerpo de la solicitud
      const dishObject = {
        ...req.body,
        id,
        ...reference,
      };

      // Crear una instancia de dishSaveDTO con los datos del plato
      const platoInstance = new dishSaveDTO(dishObject);
      const plato = { ...platoInstance };

      // Guardar el plato usando menuMgr
      const platos = await menuMgr.saveDish(req.body.categoriaSelecc, plato);

      res.status(201).json({
        status: 201,
        message: "Datos recibidos correctamente",
        data: platos, // Retorna los platos guardados si es necesario
      });
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      res.status(500).json({
        status: 500,
        message: "Error al procesar la solicitud",
        error: error.message,
      });
    }
  }

  static async actualizarArchivo(req, res) {
    res.setHeader("Content-Type", "application/json");
    const idProducto = req.params.pid;
    const reference = req.file;
    const name = req.body;
    const { platoEncontrado, category } = await menuMgr.getDish(idProducto);

    try {
      // Si hay un archivo nuevo, intenta eliminar el anterior
      if (reference) {
        const filePath = join(
          __dirname,
          "public",
          "image",
          platoEncontrado.image
        );

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error al eliminar el archivo:", err);
            return res
              .status(500)
              .json({ message: "Error al eliminar el archivo" });
          }
          console.log("Archivo eliminado con éxito");
        });
      }

      // Eliminar la propiedad 'image' de name
      delete name.image;

      // Crear el nuevo objeto dishObject
      const dishObject = {
        ...platoEncontrado,
        ...name,
        ...reference,
        categoriaSelecc: category,
      };

      // Crear una instancia de dishSaveDTO con los datos del plato
      const platoInstance = new dishSaveDTO(dishObject);
      const plato = { ...platoInstance };

      // Guardar el plato usando menuMgr
      const platos = await menuMgr.updateDish(idProducto, plato);

      res.status(200).json({
        status: 200,
        message: "Datos recibidos correctamente",
      });
    } catch (error) {
      console.error("Error durante la actualización del archivo:", error);
      res
        .status(500)
        .json({ message: "Error durante la actualización del archivo" });
    }
  }

  static async eliminarArchivo(req, res) {
    res.setHeader("Content-Type", "application/json");
    const idDish = req.params.pid;

    try {
      // Si hay un archivo nuevo, intenta eliminar el anterior
      console.log(idDish)
      const { platoEncontrado } = await menuMgr.getDish(idDish);

      console.log(platoEncontrado)
      const filePath = join(
        __dirname,
        "public",
        "image",
        platoEncontrado.image
      );

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error al eliminar el archivo:", err);
          return res
            .status(500)
            .json({ message: "Error al eliminar el archivo" });
        }
        console.log("Archivo eliminado con éxito");
      });

      const DishDelete = menuMgr.deleteDish(idDish);

      res.status(200).json({
        status: 200,
        message: "Datos recibidos correctamente",
      });
    } catch (error) {
      console.error("Error durante la actualización del archivo:", error);
      res
        .status(500)
        .json({ message: "Error durante la actualización del archivo" });
    }
  }
}
