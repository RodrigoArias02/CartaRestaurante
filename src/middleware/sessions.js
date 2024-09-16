import jwt from "jsonwebtoken";
import { configVar } from "../config/config.env.js";

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "No se pudo autenticar" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, configVar.SECRET_KEY, (error, credentials) => {
    if (error) {
      return res.status(404).send({ error: "No autorizado" });
    }
    req.user = credentials.user;
    next();
  });
};
