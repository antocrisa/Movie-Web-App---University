//Richiesta HTTP GET all'API per ottenere la lista di film
async function getMoviesList(url = "", user = {}, method) {
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}


//Richiesta HTTP GET all'API per ottenere il singolo film
async function getMovie(url = "", user = {}, method) {
  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
}

//Standardizza la visualizzazione della lista di film
function renderMoviesData(movies) {
  
  let movieHTML = "";
  movies.forEach((movie) => {
    movieHTML += `<a href="./${movie.ID}">
            <div class="col">
              <div class="card">
                <img class="card-img-top" src="${movie.CoverURL}" />
                <div class="card-body">
                  <p class="card-text">${movie.Film}</p>
                </div>
              </div>
            </div>
          </a>`;
  });
  //$("div.movies-content").append(movieHTML);
  
  
  const moviesContentDiv = document.querySelector('div.movies-content');
  moviesContentDiv.innerHTML = movieHTML;
}


//Standardizza la visualizzazione di ogni singolo film
function renderMovieData(movies) {
  
  let movie = movies;
  let container = document.getElementById("single-movie-image-card-container");
  container.style.cssText = `min-height: 480px; width: 90%; background-image: url("${movie.CoverURLDetails}");`;
      
  //Standardizza la visualizzazione del cast
  let castHTML = "";
  
  movies.cast.forEach((cast) => {
    castHTML += `<img class="bd-placeholder-img rounded-circle" width="120px" height="120px" src="${cast.CoverURL}" />`;    
  });
  //$("div#moviesCastContainer").append(castHTML);
  
  
  const moviesCastContainer = document.getElementById("moviesCastContainer");
  moviesCastContainer.innerHTML = castHTML;

  document.getElementById("aboutMovie").textContent = movie.Description;
  
  const user = JSON.parse(getSessionStorageItem("user"));
  if (user) {
    document.getElementById("moviereviewform").innerHTML = `<label for="moviereviewtextarea" class="form-label"><h1>Reviews</h1></label>
    <textarea class="form-control" id="moviereviewtextarea"></textarea>
    <button type="submit" class="btn btn-primary" onclick="postReview(); return false;">Submit</button>`;
    renderMovieReviewsData(movies.reviews);
  }
  

}


//Standardizza la visualizzazione delle recensioni o dei commenti
//Se utente loggato != da autore commento, nasconde la possibilità di cancellarlo
function renderMovieReviewsData(reviews) {

  const user = JSON.parse(getSessionStorageItem("user"));
  let html = "";
  reviews.forEach((review) => {
  html += `<div class="card mb-2">
            <div class="card-body">
              <div style="display:flex">
                <h5 class="card-title">${review.UserName}</h5>
                <a class="icon-link ${review.UserName !== user.username && "d-none"}"  style="cursor:pointer; position:absolute; right:2rem;" data-id=${review.ID} onClick=deleteReview(event)>
                <span class="bi bi-x text-danger">X</span>
                  </a>
              </div>
                <p class="card-text" >${review.Review}</p>
              </div>
            </div>`;
});
//$("div#reviewslist").empty().append(html);


const reviewslist = document.getElementById("reviewslist");
reviewslist.innerHTML = html;
}









//Logout utente corrente e reindirizzamento alla home
function logout() {
  sessionStorage.removeItem("user");
  document.location.href = "/dashboard/";
}

//Ottiene il valore di un elemento dallo spazio di archiviazione temporaneo
function getSessionStorageItem(key) {
  return sessionStorage.getItem(key);
}

//Setta il valore di un elemento dello spazio di archiviazione temporaneo
function setSessionStorageItem(key, value) {
  return sessionStorage.setItem(key, value);
}







//HTTP Post per il SignIn
async function postSignInData(url = "", userdata = {}, method) {
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userdata),
  })
    .then((res) => res.json())
    .then((data) => {

      if (data.success) {
        //$("#signInModal").modal("hide");
        //$("#signUpModal").modal("hide");
        
        
        const signInModal = document.getElementById("signInModal");
        signInModal.classList.remove("show");
        signInModal.setAttribute("style", "display: none;");
        
        const signUpModal = document.getElementById("signUpModal");
        signUpModal.classList.remove("show");
        signUpModal.setAttribute("style", "display: none;");

        document.getElementById("siginsignupbtns").style.display = "none";

        //Estrae il valore della proprietà username da userdata
        const { username } = userdata;
        let user = { username };
        setSessionStorageItem("user", JSON.stringify({ ...user, ...data }));
        const accountdetails = document.getElementById("accountdetails");
        accountdetails.innerHTML = `Hi ${username}`;
        
        const userloginDropdown = document.getElementById("userloginDropdown");
        userloginDropdown.classList.remove("hide");
        document.location.href = "./dashboard";
      } else {
        const alertSignIn = document.getElementById("alertSignIn");
        alertSignIn.innerHTML = data.message;
        alertSignIn.classList.remove("hide");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}


//SignIn
function signIn() {
  let username = document.getElementById("signInUserName").value;
  let password = document.getElementById("SignInPassword").value;
  
  postSignInData(
    "http://localhost:5000/webapp/api/login",
    {
      username,
      password,
    },
    "POST"
  ).then((data) => {
  });
}



//HTTP Post per il SignUp
async function postRegisterData(url = "", userData = {}, method) {
  
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .then((data) => {
            
      if (data.success) {
        //Usiamo lo stesso metodo per il Login per salvare i dati del nuovo utente nella SessionStorage temporanea
        postSignInData(
          "http://localhost:5000/webapp/api/login",
          {
            username: userData.username,
            password: userData.password,
          },
          "POST"
        ).then((data) => {
        });
      } else {
        alertSignUp.innerHTML = data.message;
        alertSignUp.classList.remove("hide");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//SignUp
function register() {
  
  let name = document.getElementById("SignUpNameInput").value;
  let username = document.getElementById("SignUpUserNameInput").value;
  let email = document.getElementById("SignUpEmailInput").value;
  let password = document.getElementById("SignUpPassword").value;
  
  postRegisterData(
    "http://localhost:5000/webapp/api/register",
    {
      name,
      username,
      email,
      password,
    },
    "POST"
  ).then((data) => { });
}





//HTTP Post per recensione
async function postReviewData(url = "", reviewData = {}, method) {
  
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  })
    .then((res) => res.json())
    .then((data) => {
    
      if (data.success) {
        return data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//Recensione
function postReview() {
  
  let review = document.getElementById("moviereviewtextarea").value;
  const user = JSON.parse(getSessionStorageItem("user"));
  const movie = JSON.parse(getSessionStorageItem("movie"));

  postReviewData(
    `http://localhost:5000/webapp/api/review/${movie.ID}`,
    {
      review,
      username: user.username,
    },
    "POST"
  ).then((data) => {
    //Dopo la POST, crea un nuovo oggetto recensione con i dati e l'utente corrente
    const newReview = {
      ID: data.review.id,
      Review: review,
      UserName: user.username,
      MovieId: movie.ID,
    };
    //Aggiunge la nuova recensione all'inizio dell'array delle recensioni del film
    movie.reviews.unshift(newReview);
    //Aggiorna il session storage con la nuova recensione
    setSessionStorageItem("movie", JSON.stringify(movie));
    //Renderizziamo le recensioni con l'aggiunta della nuova
    renderMovieReviewsData(movie.reviews);
  });
}

//HTTP Delete per la recensione
async function postDeleteReviewData(url = "", reviewData = {}, method) {
  
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        return data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//Rimozione recensione (possibile solo per l'autore)
function deleteReview(e) {
  
  const movie = JSON.parse(getSessionStorageItem("movie"));
  //data-id = id della recensione nel db
  const revId = e.currentTarget.getAttribute("data-id");

  postDeleteReviewData(
    `http://localhost:5000/webapp/api/review/${revId}`,
    {
      movieId: movie.ID,
    },
    "DELETE"
  ).then((data) => {
    //Nuovo array recensioni meno la recensione con l'ID corrente (revId)
    const newMovieReviews = movie.reviews.filter((review) => String(review.ID) !== String(revId));
    movie.reviews = newMovieReviews;
    //Aggiorniamo il session storage
    setSessionStorageItem("movie", JSON.stringify(movie));
    //Renderizziamo le recensioni aggiornate
    renderMovieReviewsData(movie.reviews);
  });
}


//Funzione di ricerca implementata con page.js
function onMovieSearchChange(e) {
  
  const movies = JSON.parse(getSessionStorageItem("movies"));
  //e.target.value = valore inserito nella barra di ricerca, se non trovato viene restituito l'oggetto vuoto
  const movieID = (movies.find((movie) => movie.Film === e.target.value) || {}).ID;
  
  if (movieID) {
    page("/dashboard/" + movieID);
  }
}

//Suggerimento barra di ricerca, caricata nella function "showdashboard" all'avvio della pagina
function renderAutosuggestMovies() {
  
  const movies = JSON.parse(getSessionStorageItem("movies"));
  let html = "";
  
  movies.forEach((movie) => {
    html += `<option value="${movie.Film}" data-id="${movie.ID}">`;
  });
  //datalist ID 
  moviesSearchOptions.innerHTML = html;
}






















//Test per il contenuto del session storage 

// Verifica se il valore per la chiave "user" è presente nel Session Storage
const userSessionData = getSessionStorageItem("user");
if (userSessionData) {
  const user = JSON.parse(userSessionData);
  console.log("Dati utente:", user);
} else {
  console.log("Dati utente non trovati nel Session Storage.");
}

// Verifica se il valore per la chiave "movie" è presente nel Session Storage
const movieSessionData = getSessionStorageItem("movies");
if (movieSessionData) {
  const movie = JSON.parse(movieSessionData);
  console.log("Dati film:", movie);
} else {
  console.log("Dati film non trovati nel Session Storage.");
}
