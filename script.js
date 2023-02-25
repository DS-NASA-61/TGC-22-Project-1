const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup().addTo(map);
let stallsSearchResultLayer = L.layerGroup().addTo(map);

//customize GeoJson point markers
const myIcon = L.icon({
  iconUrl: "img/food-stall.png",
  iconSize: [65, 65], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

//enable zooming to user's current location
let usercurrentLocation = L.control
  .locate({
    initialZoomLevel: 16,
    drawCircle: false,
    flyTo: true,
    strings: {
      title: "Hey,how me where I am!",
      popup: "You are here",
    },
  })
  .addTo(map);
usercurrentLocation.start();

//main function starts
function main() {
  //geojson
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    let markers = L.markerClusterGroup();
    L.geoJson(hawkerGeoJson.data, {
      onEachFeature: function (feature, layer) {
        let el = document.createElement("div");
        el.innerHTML = feature.properties.Description;
        let allTd = el.querySelectorAll("td"); //queryselecterAll returns array

        let origin = allTd[2].innerHTML;
        let name = allTd[19].innerHTML;
        let image = allTd[17].innerHTML;

        //create bindpopup html elements
        const container = document.createElement("div");
        const nameEl = document.createElement("h2");
        nameEl.innerHTML = `${name}`;
        const originEl = document.createElement("h4");
        originEl.innerHTML = `${origin}`;

        const imageEl = document.createElement("img");
        imageEl.setAttribute("src", image);
        imageEl.style.border = "5px solid yellow";
        imageEl.style.height = "350px";
        imageEl.style.width = "550px";

        const stallsButton = document.createElement("button");
        stallsButton.classList.add("btn", "btn-primary"); //Use the classList.add() method to add one or more classes to the element.
        stallsButton.setAttribute("id", "see-stalls-button"); // Set id attribute on the element
        stallsButton.innerText = "Show Stalls";
        const choiceButton = document.createElement("button");
        choiceButton.classList.add("btn", "btn-primary");
        choiceButton.setAttribute("id", "random-choice"); // Set id attribute on the element
        choiceButton.innerText = "Don't know what to eat?";

        // create interaction when click "see stalls" button will show stalls, using fsq API
        // id created by createElement cannot be accessed by addeventlistener, must use the variable name
        stallsButton.addEventListener("click", async function () {
          stallsSearchResultLayer.clearLayers();
          let lat = feature.geometry.coordinates[1];
          let lng = feature.geometry.coordinates[0];
          let coordinate = [lat, lng];
          let searchResults = await loadData(lat, lng);
          console.log(searchResults);
          L.marker(coordinate).addTo(stallsSearchResultLayer);
        });

        container.append(imageEl, nameEl, originEl, stallsButton, choiceButton);
        console.log(container);

        layer.bindPopup(container);
      },

      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
      },
    }).addTo(markers);

    markers.addTo(map);
  }
  loadHawkerGeoJson();

  //user search from landing page, using oneMap API
  document
    .querySelector("#search-button")
    .addEventListener("click", async function () {
      let searchValue = document.querySelector("#user-search").value;

      let searchResults = await getAddress(searchValue);

      //clear previous search results
      document.querySelector("#search-results-list").innerHTML = "";

      for (let result of searchResults.results) {
        //create search result list
        let resultElement = document.createElement(`div`);
        resultElement.classList.add("search-item");
        resultElement.innerText = result.ADDRESS;
        document
          .querySelector("#search-results-list")
          .appendChild(resultElement);

        //make the itme clickable
        resultElement.addEventListener("click", function () {
          document.querySelector("#landing-page").style.zIndex = "-1";
          // document.location.hash = "#map";

          // resultElement.addEventListener("click", function () {
          // document.querySelector("#map-container").style.zIndex = "6000";
          // document.location.hash = "#map";

          //create marker , customize it and add to searchResultLayer
          var pinIcon = L.icon({
            iconUrl: "img/location.png",
            iconSize: [58, 58], // size of the icon
            popupAnchor: [0, -15],
          });
          let coordinate = [result.LATITUDE, result.LONGITUDE];

          //add marker to searchResultLayer
          let marker = L.marker(coordinate, { icon: pinIcon }).addTo(
            searchResultLayer
          );

          //customize bindpopup
          let customPopup = `<p>${result.ADDRESS}</p>`;
          let customOptions = {
            className: "popupCustom", //give it class name to customize in style.css
          };
          marker.bindPopup(customPopup, customOptions);
          map.flyTo(coordinate, 16);
          // window.addEventListener("click", function () {
          //   searchResultLayer.clearLayers();
          // });
        });
      }
    });
}

let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-icon");

searchInput.addEventListener("keyup", async function () {
  //clear existing markers from search result layer
  // searchResultLayer.clearLayer();

  document.querySelector("#search-results").innerHTML = "";

  let response = await getAddress(searchInput.value);
  console.log(response ? response : "no repsonseee");

  // let seen = set();

  // try {
  //   for (let result of response.results) {
  //     if (result.SEARCHVAL in seen) {
  //       continue;
  //     } else {
  //       seen.add(result.SEARCHVAL);
  //     }

  let seen = [];
  try {
    for (let result of response.results) {
      if (seen.includes(result.SEARCHVAL)) {
        continue;
      } else {
        seen.push(result.SEARCHVAL);
      }

      let coordinate = [result.LATITUDE, result.LONGITUDE];
      let resultElement = document.createElement("div");
      resultElement.classList = "search-result";
      resultElement.innerHTML = result.SEARCHVAL;
      console.log(resultElement);
      document.querySelector("#search-results").appendChild(resultElement);
    }
  } catch (e) {
    console.log(e);
    console.log("ex ->", response);
  }

  searchBtn.addEventListener("click", function () {
    document.querySelector("#search-results").innerHTML = "";
  });
});

// adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
