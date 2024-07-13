import dotenv from 'dotenv'
import __dirname from '../utils.js';
import { join } from 'path'; // Importa la función join del módulo path

const rutaConfig = join(__dirname,'..','.env');

console.log(rutaConfig)

dotenv.config(
    {
        path: rutaConfig
    }
);

export const configVar={
    USER:process.env.USER,
    PASSWORD:process.env.PASSWORD,
    PORT: process.env.PORT
}