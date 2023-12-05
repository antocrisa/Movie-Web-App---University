//Importazione dei moduli

//Express
import express from "express";
//Connessione al DB da db.js
import { createDbConnection } from "../sql/db";

const router = express.Router();

//API che fornisce endpoint per ottenere i dati di tutti i film visualizzabili in Home (richiamata in "showDashboard")
router.get("/webapp/api/getAllMovies", async function (req, res, next) {
  
  const db = await createDbConnection();
  //Display=1 ---> visibile in Home
  let sql = "select * from movies where Display=1";

  //Non abbiamo parametri particolari per la query, quindi passiamo l'oggetto vuoto
  var params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message, success: false });
    } else {
      //Json di risposta
      res.send({
        message: "success",
        data: rows,
        success: true,
      });
    }
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});


//API che fornisce endpoint per ottenere i dati di uno specifico film (richiamata in "showMovie")
router.get("/webapp/api/getMovie/:id", async function (req, res, next) {
  
  const db = await createDbConnection();
  
  //Salviamo l'id dinamico dalla richiesta HTTP
  const id = req.params.id;
  
  let sql = `select * from movies where Display=1 and ID=${id}`;
  
  //Non abbiamo parametri particolari per la query, quindi passiamo l'oggetto vuoto
  var params = [];

  db.get(sql, params, (err, rows) => {
    if (err) {
      return res.status(400).send({ error: err.message, success: false });
    } else {
      //Selezioniamo tutte le colonne della tabella "movies_cast" in base alle condizioni del join
      let sql = `select movies_cast.* from movies inner join movies_cast on movies.ID = movies_cast.MovieId 
          where movies.Display=1 and movies.ID=${id}`;
        

      db.all(sql, params, (err, castRows) => {
        
        //Oggetto rows con chiave "cast" alla quale assegniamo il risultato della query
        rows["cast"] = castRows || null;

        //Query per le recensioni, visualizzabili solo se si è registrati (function renderMovieData)
        const reviewSQL = `select * from movie_review where MovieId=${id} order by CreatedAt Desc`;
        
        db.all(reviewSQL, params, (err, reviewRows) => {
          
          //Oggetto rows con chiave "reviews" alla quale assegniamo il risultato della query
          rows["reviews"] = reviewRows || null;
          
          res.send({
            message: "success",
            data: rows,
            success: true,
          });
        });
      });
    }
  });


  
  
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the database connection.");
  });
});

export default router;
