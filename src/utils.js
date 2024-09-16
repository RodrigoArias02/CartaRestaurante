import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { configVar } from "./config/config.env.js";
import { dirname } from "path";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Importar la función v4 de la biblioteca uuid para generar UUIDs
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function generateUniqueCode() {
  return uuidv4(); // Generar un UUID v4 como código único
}

export default __dirname;

//con "comparesync" compara la password ingresada con la password de la BD o persistencia(usuario)
export const validPassword = (passwordIngresada, password) =>
  bcrypt.compareSync(password, passwordIngresada);

export function isBcryptHash(str) {
  const bcryptRegex = /^\$2[aby]?\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
  return bcryptRegex.test(str);
}

export const generateToken = (user) => {
  const token = jwt.sign({ user }, configVar.SECRET_KEY, { expiresIn: "12h" });
  return token;
};

export const getCategoryNameById = (id) => {
  const categoryMap = {
    "b12a761b-7e36-4e9a-9f68-8a879fa877f7": "carne",
    "c9a29f92-945b-4af5-9e07-fcfb5a2e3c6a": "cerdo",
    "e982fd42-4b2f-4480-9ff4-6e09c31c992b": "pollo",
    "f4a017ae-5c67-4f52-bde6-8f197746e22c": "pescado"
  };
  return categoryMap[id] || "Categoría desconocida"; // Devuelve un mensaje predeterminado si el ID no existe
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/public/image/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const validarArchivo= (fotoInput, index) => {
  const file = fotoInput ? fotoInput.files[0] : null;
  let contenido = null;



  // Aquí puedes manejar qué hacer con el contenido
  console.log(contenido);

  return contenido;
}