document.addEventListener('DOMContentLoaded', async function() {
  loadPopularMovies(); 
})

const apiKey = '6c65da1d5c9aa271fa8c84ae76187f96'; 

let currentSearchType = 'movie'

/*Search Movies or Series*/

document.querySelector('.btn-search').addEventListener('click', () => {
  const searchInput = document.getElementById('searchInput').value.trim();

  if (!searchInput) {
    alert('Por favor ingresa el nombre de una película o serie.');
    return;
  }

  if (currentSearchType === 'movie') {
    searchMovies(searchInput);
  } else if (currentSearchType === 'tv') {
    searchSeries(searchInput);
  }
});

/*Set Active btn*/

function setActiveMenu(type) {
  const links = document.querySelectorAll('.nav-menu li a');
  links.forEach(link => link.classList.remove('active'));

  if (type === 'movie') {
    document.querySelector('.nav-menu li a[onclick="loadPopularMovies()"]').classList.add('active');
  } else if (type === 'tv') {
    document.querySelector('.nav-menu li a[onclick="loadPopularSeries()"]').classList.add('active');
  }else if (type === 'about') {
    document.querySelector('.nav-menu li a[onclick="loadAbout()"]').classList.add('active');
  }
}

async function searchMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  
  const response = await fetch(url);
  const data = await response.json();

  const resultsDiv = document.getElementById('resultsMedia');
  resultsDiv.innerHTML = '';

  data.results.forEach(movie => {
    resultsDiv.appendChild(createMovieCard(movie));
  });
  document.querySelector('.title-movies').textContent = '🎥 Results Movies';
  document.getElementById('searchInput').value = '';
}

async function searchSeries(query) {
  const url = `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  const data = await response.json();

  const resultsDiv = document.getElementById('resultsMedia');
  resultsDiv.innerHTML = '';

  data.results.forEach(series => {
    resultsDiv.appendChild(createSeriesCard(series));
  });
  document.querySelector('.title-movies').textContent = '📺 Results Series';
  document.getElementById('searchInput').value = '';
}

/*Load Trendind Movies */
async function loadPopularMovies() {
  const aboutSection = document.getElementById('aboutSection');
  if (aboutSection) aboutSection.style.display = 'none';

  const results = document.getElementById('results');
  if (results) results.style.display = 'block';

  const carouselContainer = document.getElementsByClassName('carousel-container');
  if (carouselContainer.length > 0) carouselContainer[0].style.display = 'block';

  currentSearchType = 'movie';
  setActiveMenu('movie');
  loadCarousel();
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  const popularDiv = document.getElementById('resultsMedia');
  popularDiv.innerHTML = ''; 
  data.results.slice(0, 12).forEach(movie => {
  popularDiv.appendChild(createMovieCard(movie));
  });

}
/*Load Trendind Series */
async function loadPopularSeries() {
  const aboutSection = document.getElementById('aboutSection');
  if (aboutSection) aboutSection.style.display = 'none';

  const results = document.getElementById('results');
  if (results) results.style.display = 'block';

  const carouselContainer = document.getElementsByClassName('carousel-container');
  if (carouselContainer.length > 0) carouselContainer[0].style.display = 'block';

  currentSearchType = 'tv';
  setActiveMenu('tv');
  loadCarousel();
  const url = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  const popularDiv = document.getElementById('resultsMedia');
  popularDiv.innerHTML = ''; 

  data.results.slice(0, 12).forEach(series => {
    popularDiv.appendChild(createSeriesCard(series));
  });
}


function getStars(rating) {
  const fullStars = Math.round(rating / 2);
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
}

/*Load About us Section*/
async function loadAbout() {
  currentSearchType = null;
  setActiveMenu('about');
  const results = document.getElementById('results');
  if (results) results.style.display = 'none';

  const carouselContainer = document.getElementsByClassName('carousel-container');
  if (carouselContainer.length > 0) carouselContainer[0].style.display = 'none';

  const modal = document.getElementById('movieModal');
  if (modal) modal.style.display = 'none';

  const aboutSection = document.getElementById('aboutSection');
  if (aboutSection) aboutSection.style.display = 'block';

  const grid = document.getElementById('aboutMediaGrid');
  if (grid) grid.innerHTML = '';

  const [moviesRes, seriesRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`),
    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`)
  ]);

  const movies = await moviesRes.json();
  const series = await seriesRes.json();

  const combinedMedia = [...movies.results.slice(0, 8), ...series.results.slice(0, 8)];

  combinedMedia.forEach(item => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    img.alt = item.title || item.name;
    grid.appendChild(img);
  });
}


/*Movies card*/
function createMovieCard(movie) {
  const div = document.createElement('div');
  document.querySelector('.title-movies').textContent = '🎥 Trending Movies';
  div.classList.add('movie');
  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <div class="movie-info">
      <h4>${movie.title}</h4>
      <p><strong>Premiere:</strong> ${movie.release_date || 'N/A'}</p>
      <p><strong>Rating:</strong> ${getStars(movie.vote_average)}</p>
    </div>
  `;
  div.addEventListener('click', () => viewDetails(movie.id));
  return div;
}

/*Series Card */
function createSeriesCard(series) {
  const div = document.createElement('div');
  document.querySelector('.title-movies').textContent = '📺 Trending Series';
  div.classList.add('movie'); 
  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" alt="${series.name}">
    <div class="movie-info">
      <h4>${series.name}</h4>
      <p><strong>Premiere:</strong> ${series.first_air_date || 'N/A'}</p>
      <p><strong>Rating:</strong> ${getStars(series.vote_average)}</p>
    </div>
  `;
  div.addEventListener('click', () => viewSeriesDetails(series.id));
  return div;
}

/*Carousel Slides*/ 

let currentSlide = 0;
let slideInterval;


function nextSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide + 1) % totalSlides;
  updateCarousel();
}

function prevSlide() {
  const totalSlides = document.querySelectorAll('.carousel-slide').length;
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

function startAutoSlide() {
  clearInterval(slideInterval)
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

document.getElementById('carousel').addEventListener('mouseenter', stopAutoSlide);
document.getElementById('carousel').addEventListener('mouseleave', startAutoSlide);

/*Carousel creation*/

function createCarouselSlide(item) {
  const isMovie = !!item.title;
  const title = item.title || item.name;
  const overview = item.overview || 'Description not available.';
  const backdrop = item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : '';
  const btnAction = isMovie
    ? `viewDetails(${item.id})`
    : `viewSeriesDetails(${item.id})`;

  const slide = document.createElement('div');
  slide.classList.add('carousel-slide');
  slide.innerHTML = `
    <img src="${backdrop}" alt="${title}">
    <div class="carousel-caption">
      <h3>${title}</h3>
      <p>${overview}</p>
      <button onclick="${btnAction}">See more</button>
    </div>
  `;
  return slide;
}

function createIndicator(index) {
  const indicator = document.createElement('span');
  indicator.addEventListener('click', () => {
    currentSlide = index;
    updateCarousel();
  });
  return indicator;
}

function updateCarousel() {
  const carousel = document.getElementById('carousel');
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

  const indicators = document.querySelectorAll('.carousel-indicators span');
  indicators.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

async function loadCarousel() {
  let type = "";
  if (currentSearchType === 'movie') {
    type = 'movie';
  }else if (currentSearchType === 'tv') {
    type = 'tv';
  }
  if (!type) return; 
  const url = `https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}&language=en-US&page=1`;
  const response = await fetch(url);
  const data = await response.json();

  const carousel = document.getElementById('carousel');
  const indicators = document.getElementById('indicators');
  carousel.innerHTML = '';
  indicators.innerHTML = '';

  data.results.slice(0, 5).forEach((item, index) => {
    carousel.appendChild(createCarouselSlide(item));
    indicators.appendChild(createIndicator(index));
  });
  currentSlide = 0;
  updateCarousel();
  startAutoSlide();
}



window.onclick = function(event) {
  const modal = document.getElementById('movieModal');
  if (event.target === modal) {
    closeModal();
  }
};


async function viewDetails(movieId) {
  const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const videoUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

  const [movieRes, videoRes] = await Promise.all([
    fetch(movieUrl),
    fetch(videoUrl)
  ]);

  const movie = await movieRes.json();
  const videos = await videoRes.json();

  // Movies trailer from YouTube
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  document.getElementById('modalImage').src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
  document.getElementById('modalTitle').textContent = movie.title;
  document.getElementById('modalOverview').textContent = movie.overview || 'Descriptuion not available';
  document.getElementById('modalDate').textContent = movie.release_date || 'Date not available';
  document.getElementById('modalRating').textContent = `${getStars(movie.vote_average)} (${movie.vote_average.toFixed(1)} / 10)`;  
  document.getElementById('modalGenres').textContent = movie.genres.map(g => g.name).join(', ');

  if (trailer) {
    document.getElementById('modalTrailer').src = `https://www.youtube.com/embed/${trailer.key}`;
    document.getElementById('modalTrailerContainer').style.display = 'block';
  } else {
    document.getElementById('modalTrailerContainer').style.display = 'none';
  }

  document.getElementById('movieModal').style.display = 'block';
}

async function viewSeriesDetails(seriesId) {
  const seriesUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=en-US`;
  const videoUrl = `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}&language=en-US`;

  const [seriesRes, videoRes] = await Promise.all([
    fetch(seriesUrl),
    fetch(videoUrl)
  ]);

  const series = await seriesRes.json();
  const videos = await videoRes.json();

  // Series trailer from YouTube
  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  document.getElementById('modalImage').src = `https://image.tmdb.org/t/p/w500${series.backdrop_path}`;
  document.getElementById('modalTitle').textContent = series.name;
  document.getElementById('modalOverview').textContent = series.overview || 'Description not available';
  document.getElementById('modalDate').textContent = series.first_air_date || 'Date not available';
  document.getElementById('modalRating').textContent = `${getStars(series.vote_average)} (${series.vote_average.toFixed(1)} / 10)`;  
  document.getElementById('modalGenres').textContent = series.genres.map(g => g.name).join(', ');

  if (trailer) {
    document.getElementById('modalTrailer').src = `https://www.youtube.com/embed/${trailer.key}`;
    document.getElementById('modalTrailerContainer').style.display = 'block';
  } else {
    document.getElementById('modalTrailerContainer').style.display = 'none';
  }

  document.getElementById('movieModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('movieModal').style.display = 'none';
  document.getElementById('modalTrailer').src = ''; 
}

/*Switch to light-mode*/
function toggleTheme() {
  const logo = document.querySelector(".nav-logo");
  const isLight = document.body.classList.toggle('light-mode');
  if(isLight){
    logo.src = './assests/images/logo.svg';
  }else{
    logo.src = './assests/images/logo-dark-mode.svg'
  }
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

window.onload = function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('themeSwitch').checked = true;
  }
};

/*Hambuger Menu */

document.getElementById('hamburger').addEventListener('click', () => {
  const navContainer = document.querySelector('.nav-container');
  const theme_toggle = document.querySelector(".theme-toggle");
  navContainer.classList.toggle('show');
  theme_toggle.classList.toggle('show');
});


