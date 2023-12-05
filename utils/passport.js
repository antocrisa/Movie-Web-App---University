//Importazione moduli

//Passport per autenticazione tramite JSON web token
import passportJWT from "passport-jwt";
import passport from "passport";
//Dotenv per utilizzo variabile d'ambiente
import * as dotenv from "dotenv";
//Connessione DB da db.js
import { createDbConnection } from "../sql/db";

//Legge ed imposta le veriabili d'ambiente
dotenv.config();

async function verifyJWT() {
  var opts = {};
  //Recupera il token dall'header della richiestta HTTP al server (posso vedere il token nella console che mi mostra il session storage)
  opts.jwtFromRequest = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken();
  //Recupera il segreto da .env per poter verificare il token
  opts.secretOrKey = process.env.PASSPORT_SECRET_LEY;

  //Strategia di autenticazione, la callback viene chiamata una volta verificato il token
  passport.use(
    new passportJWT.Strategy(opts, async function (jwt_payload, done) {
      //Salviamo il valore dell'username estrapolato dal payload (verifica del token)
      const { username } = jwt_payload || {};
      const db = await createDbConnection();
      const sql = `SELECT * FROM user WHERE username  = ?`;
      
      //Richiesta al DB dell'user specifico {username}
      db.get(sql, [username], (err, row) => {
        if (err) {
          console.error(err.message);
          return done(err, false);
        }
        if (!row) {
          return done(null, null);
        } else {
          return done(null, row);
        }
      });
    })
  );
}

export { verifyJWT };
