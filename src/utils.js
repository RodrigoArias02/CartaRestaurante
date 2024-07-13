import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { dirname } from "path";
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