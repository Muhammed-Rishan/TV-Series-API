const seriesImageElement = document.querySelector(".series-image");
const seriesTitle = document.querySelector(".series-title");
const seriesList = document.querySelector(".series-list");
const seriesSummary = document.querySelector(".series-summary");

const series = [
  { id: 82, title: "Game of Thrones" },
  { id: 169, title: "Breaking Bad" },
  { id: 431, title: "Friends" },
  { id: 2993, title: "Stranger Things" },
  { id: 96, title: "Manhattan Love Story" },
  { id: 140, title: "Looking" },
  { id: 216, title: "Rick And Morty" }
];

series.forEach(show => {
  const seriesItem = document.createElement("li");
  seriesItem.classList.add("series-item");
  seriesItem.textContent = show.title;
  seriesItem.addEventListener("click", () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `https://api.tvmaze.com/shows/${show.id}?embed=episodes`);
    xhr.onload = function() {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        const seriesImage = data.image.medium;
        const episodes = data._embedded.episodes;
        const summary = data.summary;

        seriesTitle.textContent = data.name;
        seriesImageElement.src = seriesImage;
        seriesSummary.innerHTML = summary;

        const seasonEpisodes = episodes.reduce((seasons, episode) => {
          const season = episode.season;
          if (!seasons[season]) {
            seasons[season] = [];
          }
          seasons[season].push(episode);
          return seasons;
        }, {});

        const seasonsContainer = document.querySelector(".seasons-container");
        seasonsContainer.innerHTML = "";

        Object.keys(seasonEpisodes).forEach(season => {
          const seasonContainer = document.createElement("div");
          seasonContainer.classList.add("season-container");
          const seasonTitle = document.createElement("h2");
          seasonTitle.classList.add("season-title");
          seasonTitle.textContent = `Season ${season}`;
          seasonContainer.appendChild(seasonTitle);

          const episodeList = document.createElement("ul");
          episodeList.classList.add("episode-list");

          seasonEpisodes[season].forEach(episode => {
            const episodeTitle = document.createElement("li");
            episodeTitle.classList.add("episode-title");
            episodeTitle.textContent = episode.name;
            episodeList.appendChild(episodeTitle);
          });

          seasonContainer.appendChild(episodeList);

          const seasonImage = document.createElement("img");
          seasonImage.classList.add("season-image");
          seasonImage.src = data.image.medium;
          seasonContainer.appendChild(seasonImage);

          seasonsContainer.appendChild(seasonContainer);

          seasonTitle.addEventListener("click", () => {
            if (episodeList.style.display === "none") {
              // if episode list is hidden, fetch the season data and show it
              fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`)
                .then(response => response.json())
                .then(data => {
                  seasonImage.src = data[season - 1].image.medium;
                  seasonImage.style.display = "block";
                })
                .catch(error => console.log(error));
                
              episodeList.style.display = "block";
              seasonTitle.classList.add("open");
            } else {
              // if episode list is shown, hide it
              episodeList.style.display = "none";
              seasonImage.style.display = "none";
              seasonTitle.classList.remove("open");
            }
        });
    });
  }
};
xhr.send();
});

seriesList.appendChild(seriesItem);
});

         
