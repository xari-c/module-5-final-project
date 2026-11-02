// API: https://www.omdbapi.com/?apikey=5ebfc59b&s=marvel
// let movies;

// async function renderMovies() {
//   const moviesWrapper = document.querySelector(".movies");
//   moviesWrapper.classList += ' movies__loading';

//   if (!movies) {
//     movies = await getMovies();
//   }

//   console.log(movies)

//   moviesWrapper.classList.remove ('movies__loading');
  
//   const moviesHTML = movies.map (movie => {
//     [REUSED]
// }

// function filterMovies(event) {
//   renderMovies(event.target.value);
// }

const API_KEY = '5ebfc59b';
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const searchDefault = 'Marvel';
const moviesGrid = document.querySelector('#moviesGrid'); 
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies= [];

// Event Listener

//button type is 'submit', so the listener can listen for that here
let searchTerm = 'Marvel'
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); //prevents the default action of it refreshing the whole page
  const searchTerm = searchInput.value.trim(); //trims any extra spaces off of whatever's typed into the search bar and stores that value in searchTerm
  if(searchTerm) {
    fetchMovies(searchTerm);
  } 
   if (!searchTerm) { 
     fetchMovies('Marvel')
   }
});

const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`) //hard-coded rn. make dynamic to change "marvel" to search input word
  const data = await res.json();
  
//Fetch movies from API
async function fetchMovies(searchTerm) {
  // showSkeletons();

  

  if (data.Response === 'True') { //aka "if you get a response"
    currentMovies = data.Search;//What we're doing returns an object with Search and a couple other arrays, so we add .Search to say we only wanna look in that array

    //not having the .Search (aka not specifying where to look) throws a "movies.map is not a function" error
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    sortSelect.value = 'default';
    displayMovies(currentMovies);
  } else {
    resultsInfo.textContent = `Showing: ${searchTerm}`;
    moviesGrid.innerHTML = `<p>No movies found<p>`;
    currentMovies = [];
  }
}

function displayMovies(movies) {
  const movieResults = movies.map((movie) => {
    const poster = movie.Poster !== 'N/A' ? movie.Poster : '';

    return `
      <div class="movie-card">
        ${poster ? `<img
          class="movie-card__img"
          src="${poster}"
          alt="${movie.Title}"/>` : ''}
        <h2 class="movie-card__title">${movie.Title}</h2>
        <p class="movie-card__year">${movie.Year}</p>
      </div>
      `;
   }).join("");

   moviesGrid.innerHTML = movieResults;


   //Error listener for the posters
   moviesGrid.querySelectorAll(".movie-card__img").forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'movie-card__poster-placeholder';
      placeholder.innerHTML = 'Movie Poster<br>Not Available';
      img.replaceWith(placeholder);
    });
   });
  }