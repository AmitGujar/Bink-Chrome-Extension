window.onload = function () {
  init();
  document.querySelector("#change-btn").addEventListener("click", () => {
    unsplashGetPhotos();
  });
};

window.addEventListener('load', function () {
  console.log('All assets are loaded')
  var searchButton = document.getElementById("search-btn");
  searchButton.addEventListener("click", function () {
    var searchQuery = document.getElementById("input-query").value;
    var searchURL;
    if (searchQuery === '') 
    {
      alert("Oooh..!! Enter Something");
    }
    else {
    searchURL = "https://www.bing.com/search?q=" + searchQuery;
    window.open(searchURL);
    window.close();
    }
  })

  var input = document.getElementById("input-query");
  input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("search-btn").click();
    }
});

})

function init() {
  fetchImage();
  getTime();
  getQuotes();
}

//api access key
const clientID = "?client_id=8249d860403116cd4d1f60d039c9decb42300d417588a4d5960e8630f47a14cf";

function getQuotes() {
  fetch("https://quote-garden.herokuapp.com/quotes/random")
      .then(res => res.json())
      .then(data => {
        document.querySelector('#quotes').innerHTML = `<h5 style='font-size:25px'>"${data.quoteText}"</h4><h5 style='font-size:20px'><i> by - ${data.quoteAuthor}</i></h5>`;
      })
}

function fetchImage() {
  const img = new Image();
  document.getElementById("background-container").style.opacity = 0;
  img.onload = function () {
    document.getElementById("background-container").style.backgroundImage = `url(${this.src})`;
    document.getElementById("background-container").style.opacity = 1;
    document.getElementById("background-container").style.opacity = 1;
  };

  if (localStorage.getItem("url") === null) {
    img.src = "styles/default.jpg";
  } else {
    img.src = localStorage.getItem("url");
    credit.innerHTML = `<a target="_blank">${localStorage.getItem("name")}</a>`;
    navigate.innerHTML = `<a target="_blank"  style="color : white; font-size:130%;" href="${localStorage.getItem("link")}">Download Photo</a>`;
  }
}

function unsplashGetPhotos() {
  fetch(`https://api.unsplash.com/photos/random${clientID}`)
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("url", data.urls.full);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("link", data.links.html);
    })
    .then(() => {
      fetchImage();
    })
    .catch((err) => {
      console.error(err);
    })
}


function getTime() {
  var systemDate = new Date();
  var hours = systemDate.getHours();
  var minutes = systemDate.getMinutes();
  var ampm = hours >= 24 ? "pm" : "am";
  var twelve = hours % 24;
  hours = twelve == 0 ? 24 : twelve;
  _hours = checkTimeAddZero(hours);
  _minutes = checkTimeAddZero(minutes);
  //Only update if time is changed, this will prevent unnecessary re-render
  var timeInDOM = document.getElementById("current-time").innerHTML;
  var timeString = _hours + ":" + _minutes;
  if (timeInDOM !== timeString) {
      document.getElementById("current-time").innerHTML = timeString;
  }
}
// getTime() will be called in every 1 second of interval
setInterval(getTime, 1000);

//Function add zero
function checkTimeAddZero(i) {
  if (i < 10) {
      i = "0" + i;
  }
  return i;
}