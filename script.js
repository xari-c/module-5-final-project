// API: https://www.omdbapi.com/?apikey=5ebfc59b&s=marvel

const API_KEY = '5ebfc59b';
const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const searchDefault = 'Avengers';
const moviesGrid = document.querySelector('#moviesGrid'); 
const resultsInfo = document.querySelector('#resultsInfo');
const sortSelect = document.querySelector('#sortSelect');

let currentMovies= [];


fetchMovies(searchDefault);

// Event Listener¹
searchForm.addEventListener('submit', (e) => {
  e.preventDefault(); //²
  searchTerm = searchInput.value.trim(); //³
  if(searchTerm) {
    fetchMovies(searchTerm);
  }
});

//Fetch movies from API
async function fetchMovies(searchTerm) {
  // showSkeletons();
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`) //⁴
  const data = await res.json();

  if (data.Response === 'True') {
    currentMovies = data.Search;//⁵
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
  
  
  sortSelect.addEventListener('change', (event) => {
    sortMovies(event.target.value)
    console.log(event.target.value)
  });

  function sortMovies(sortType) {
    let sortedMovies = [...currentMovies];//⁶

    if (sortType === 'a-z') {//⁷
      sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title))
    } else if (sortType === 'z-a') {
      sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title))
    } else if (sortType === 'newest') {
      sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year))
    } else if (sortType === 'oldest') {
      sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year))
    }

    displayMovies(sortedMovies);
  }




// Annotations
// 1 | button type is 'submit', so the listener can listen for that here
// 2 | prevents the default action of it refreshing the whole page 
// 3 | trims any extra spaces off of whatever's typed into the search bar and stores that value in searchTerm
// 4 | hard-coded rn. make dynamic to change "marvel" to search input word
// 5 | What we're doing returns an object with Search and a couple other arrays, so we add .Search to say we only wanna look in that array. not having the .Search (aka not specifying where to look) throws a "movies.map is not a function" error
// 6 | the elipses mean "spread operator." They basically make a copy of currentMovies for you to dick around with without messing up the original page of data, kind of like  making a new branch to experiment on. If we overwrote by just using [currentMovies] instead of [...currentMovies], we wouldn't be able to get the deafault screen back
// 7 | here, wer'e careful to put the VALUE assigned to each of the select options in the HTML, rather that the string stored there (ex. the value is 'a-z', while the string seen on the webpage is 'A - Z). The listener is looking for a value, so we feed it what we assigned the value of each option to be.
