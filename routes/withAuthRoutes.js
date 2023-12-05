//Importazione dei moduli

//Express
import express from "express";
//Connessione al DB
import { createDbConnection } from "../sql/db";
//Bcrypt per hashing password
import { hashSync, compareSync } from "bcrypt";
//Passport per JSON web token
import jwt from "jsonwebtoken";
import passport from "passport";
//VerifyJWT per verifica token
import { verifyJWT } from "../utils/passport";

const router = express.Router();
const app = express();

app.use(passport.initialize());
verifyJWT();

//API che fornisce endpoint per registrazione nuovo utente, il parametro next permette di passare in automatico il controllo all'API per il login, così da rendere già loggato il nuovo utente registrato
router.post("/webapp/api/register", async function (req, res, next) {
  
  //Oggetto con i dati della registrazione
  const { name, username, email, password } = req.body;
  const db = await createDbConnection();
  //Oggetto data
  const created_at = Date.now();

  try {
    db.run(
      `INSERT INTO user (Name, Username, Email, Password,CreatedAt) VALUES (?, ?, ?, ?, ?)`,
      [name, username, email, hashSync(password, 10), created_at],
      function (error) {
        if (error) {
          console.error(error.message);
          res.status(400);
          res.send({
            success: false,
            message: "Registration failed, " + error.message,
            error,
          });
        } else {
          res.send({
            success: true,
            message: "Registration successfully",
            user: {
              //lastID è una proprietà che permette di memorizzare l' ID dell'ultima riga inserita nel database durante l'operazione di registrazione
              id: this.lastID,
              username,
            },
          });
        }
      }
    );
  } catch (error) {
    console.error("DB error", error);
    res.status(400);
    res.send({
      success: false,
      message: "Registration failed!",
      error,
    });
  }
  db.close();
});





//API che fornisce endpoint per login utente
router.post("/webapp/api/login", async (req, res) => {
  
  const { username, password } = req.body;
  const db = await createDbConnection();
  const sql = `SELECT * FROM user WHERE username  = ?`;
  
  db.get(sql, [username], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    if (!row) {
      res.json({
        success: false,
        message: "Login failed",
      });
    } else {
      //Confronta la pass inserita con quella presente in tabella
      if (compareSync(password, row.Password)) {
        //Salviamo i dati utente in oggetto payload per poter generare il token
        const payload = {
          username: row.UserName,
          password: row.Password,
        };
        
        //Token generato con la combinazione payload-segreto del file .env
        const token = jwt.sign(payload, process.env.PASSPORT_SECRET_LEY);
        res.status(200).send({
          success: true,
          message: "Login Successfully",
          token: `Bearer ${token}`,
        });
      } else {
        res.json({
          success: false,
          message: "Login failed, password is wrong",
        });
      }
    }
  });
});


//API che fornisce endpoint per inserimento recensione
router.post("/webapp/api/review/:id", async function (req, res, next) {
  
  const { review, username } = req.body;
  const movieid = req.params.id;

  const db = await createDbConnection();
  const created_at = Date.now();
  
  try {
    db.run(
      `INSERT INTO movie_review (Review, UserName, MovieId, CreatedAt) VALUES (?, ?, ?, ?)`,
      [review, username, movieid, created_at],
      function (error) {
        if (error) {
          console.error(error.message);
          res.status(400);
          res.send({
            success: false,
            message: "Failed " + error.message,
            error,
          });
        } else {
          res.send({
            success: true,
            message: "Review successfully",
            review: {
              id: this.lastID,
            },
          });
        }
      }
    );
  } catch (error) {
    console.error("DB error", error);
    res.status(400);
    res.send({
      success: false,
      message: "Review failed",
      error,
    });
  }
  db.close();
});


//API che fornisce endpoint per eliminare recensione
router.delete("/webapp/api/review/:id", async function (req, res, next) {
  
  const reviewId = req.params.id;

  const db = await createDbConnection();

  try {
    db.run(`DELETE from movie_review where ID=${reviewId}`, function (error) {
      if (error) {
        console.error(error.message);
        res.status(400);
        res.send({
          success: false,
          message: "Failed " + error.message,
          error,
        });
      } else {
        res.send({
          success: true,
          message: "Review deleted",
        });
      }
    });
  } catch (error) {
    console.error("DB error ", error);
    res.status(400);
    res.send({
      success: false,
      message: "Failed",
      error,
    });
  }
  db.close();
});


export default router;
