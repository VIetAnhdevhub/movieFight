const autoCompleteConfig = {
  renderMovie(movie) {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    // handling movie picture catch error
    return `
        <img src = "${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(search) {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "3f371e1",
        s: search
      }
    });
    if (response.data.Error) {
      return [];
      // handling error
    }
    return response.data.Search;
  }
};
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    document.querySelector(".tutorial").classList.add("is-hidden");
  }
});
createAutoComplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect(movie) {
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    document.querySelector(".tutorial").classList.add("is-hidden");
  }
});
let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, sideSelect, side) => {
  const response = await axios.get("https://www.omdbapi.com/", {
    params: {
      apikey: "3f371e1",
      i: movie.imdbID
    }
  });
  sideSelect.innerHTML = movieTemplate(response.data);
  if (side === "left") {
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  }
  if (leftMovie && rightMovie) {
    runComparision();
  }
};
const runComparision = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );
  leftSideStats.forEach((leftStat, index) => {
    const leftValue = parseInt(leftStat.dataset.value);
    const rightStat = rightSideStats[index];
    const rightValue = parseInt(rightStat.dataset.value);
    if (leftValue < rightValue) {
      leftStat.classList.remove("is-primary");
      leftStat.classList.add("is-warning");
    } else {
      rightStat.classList.remove("is-primary");
      rightStat.classList.add("is-warning");
    }
  });
};
const movieTemplate = (movieDetail) => {
  const boxOffice = parseInt(
    movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
  );
  const metaScore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat(movieDetail.imdbRating);
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));
  const reward = movieDetail.Awards.split(" ").reduce((total, currenValue) => {
    const value = parseInt(currenValue);
    if (value) {
      return total + value;
    } else return total;
  }, 0);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value = ${reward} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>
  <article data-value = ${boxOffice} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>
  <article data-value = ${metaScore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
  </article>
  <article data-value = ${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>
  <article data-value =${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
  </article>
    `;
};
