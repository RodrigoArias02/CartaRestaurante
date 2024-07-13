import { Router } from "express";
import { CartsControllers } from "../controllers/menu.controllers.js";
const router = Router();

router.get("/", CartsControllers.renderMenu );
router.get("/login", CartsControllers.renderLogin );
router.get("/:platoId/:nombreId", CartsControllers.menuId );
router.post("/logueo" ,CartsControllers.userLogueo);
export default router;