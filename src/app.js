import express from "express";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { configVar } from "./config/config.env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = configVar.PORT;

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodssByDefault: true,
    },
  })
);

app.set('view engine', 'handlebars');

app.set('views', join(__dirname,'views'));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "./public")));


// Rutas
import routerMenu from "./routes/views.routes.js";

app.use("/", routerMenu);


// Iniciar servidor
let serverHttp = app.listen(PORT, () => {
    console.log("Servidor iniciado en el puerto:", PORT);
  });