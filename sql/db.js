//Importazione dei moduli

//Sqlite3 per connessione al DB
import sqlite3 from "sqlite3";
//Path per gestire i percorsi dei file e delle directory
import path from "path";
//Url per la gestione degli url
import url from "url";

//Attivazione del collegamento con sqlite
sqlite3.verbose();

//Percorso del file corrente
const __filename = url.fileURLToPath(import.meta.url);
//Percorso della directory corrente
let __dirname = path.dirname(__filename);
//Uniamo url dela directory corrente con il file del DB
const filepath = path.join(__dirname, "web_app.db");


//Connessione al DB
async function createDbConnection() {
  
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }
  });
  console.log("Connection with SQLite has been established");
  return db;
}

//Rendiamo disponibile all'esterno
export { createDbConnection};
