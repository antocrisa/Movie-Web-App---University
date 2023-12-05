//Importazione dei moduli

//Express 
import express from "express";
//Path per gestire i percorsi dei file e delle directory
import path from "path";
//FS per operazioni con file system
import fs from "fs";
//Url per la gestione degli url
import url from "url";
//API
import withAuthRoutes from "./routes/withAuthRoutes";
import commonRoutesWithoutAuth from "./routes/commonRoutesWithoutAuth";
//Variabile d'ambiente per la porta 
import * as dotenv from "dotenv";

dotenv.config();

//Percorso del file corrente
const __filename = url.fileURLToPath(import.meta.url);
//Percorso della directory corrente
let __dirname = path.dirname(__filename);
//Uniamo il percorso della directory corrente con la cartella "src" che contiene la dashboard
__dirname = path.join(__dirname, "src");

//Creazione dell'app Express
const app = express();


//Reindirizzamento automatico per la cartella dashboard
app.get("/", (req, res) => {
  res.redirect("/" + "dashboard" + "/");
});

//Route dinamica per l'indirizzamento ad index.html
app.get("/:view/", (req, res)=> {
  const {view} = req.params;
  res.sendFile(path.join(__dirname, view, "index.html"));
});

//Route dinamica per poter accedere ai file(css,js) nella directory rappresentata da view
app.get("/:view/:file", (req, res, next) => {
  const {view, file} = req.params;
  if (!file) return next();
  const filePath = path.join(__dirname, view, file);

  fs.stat(filePath, (err, stat) => {
    if (err) {
      res.redirect(`/${view}/`);
    }else{
    res.sendFile(filePath);
    };
  });
})


//Abilitano l'utilizzo delle richieste json e url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Abilitano l'uso delle api
app.use(commonRoutesWithoutAuth);
app.use(withAuthRoutes);

//Avvio del server Express
app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`listening on port ${process.env.APP_PORT}`);
});