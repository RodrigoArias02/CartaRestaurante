import { Router } from "express";
import { CartsControllers } from "../controllers/menu.controllers.js";
import { authToken } from "../middleware/sessions.js";
import { upload } from "../utils.js";
const router = Router();

router.get("/", CartsControllers.renderMenu );

router.get("/:platoId/:nombreId", CartsControllers.menuId );

//formulario de logueo
router.get("/login", CartsControllers.renderLogin );

//generacion de token y redireccion de admin
router.post("/logueo" ,CartsControllers.userLogueo);

//extrae token del localstorage y tira fetch a token(para verificar validez del mismo)
router.get("/obtenerPlatos", CartsControllers.obtenerPlatos );

router.get("/admin", CartsControllers.renderAdmin );
// verifica validez con el middleware, si lo pasa entra a verifyToken.
router.get("/token", authToken ,CartsControllers.verifyToken );

router.get("/token", authToken ,CartsControllers.verifyToken );

router.post("/subirElemento",upload.single('image') ,CartsControllers.subirArchivo);

router.put("/actualizarElemento/:pid",upload.single('image') ,CartsControllers.actualizarArchivo);

router.delete("/eliminarElemento/:pid" ,CartsControllers.eliminarArchivo);

export default router;