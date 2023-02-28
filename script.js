const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup().addTo(map);
let stallsSearchResultLayer = L.layerGroup().addTo(map);

let constructionStatus;

//customize GeoJson point markers
const myIcon = L.icon({
  iconUrl: "img/food-stall.png",
  iconSize: [65, 65], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

//customize GeoJson point markers
const myIconUC = L.icon({
  iconUrl: "img/under-construction.png",
  iconSize: [65, 65], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

//create marker , customize it and add to searchResultLayer
let pinIcon = L.icon({
  iconUrl: "img/location.png",
  iconSize: [58, 58], // size of the icon
  popupAnchor: [0, -15],
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

//using fsq API to generate random food option
function getRandomLatLng() {}

//main function starts
function main() {
  //get geojson data
  async function loadHawkerGeoJson() {
    let hawkerGeoJson = await axios.get("hawker-centres-geojson.geojson");
    console.log(hawkerGeoJson.data);

    //define a function to be used onEachFeature later to customize bindPopUp
    function onEachFeature(feature, layer) {
      let el = document.createElement("div");
      el.innerHTML = feature.properties.Description;
      let allTd = el.querySelectorAll("td"); //queryselecterAll returns array

      let origin = allTd[2].innerHTML;
      let name = allTd[19].innerHTML;
      let image = allTd[17].innerHTML;
      let status = allTd[3].innerHTML;

      // Check if the hawker center is under construction or not, just a sanity check
      if (status == "Under Construction") {
        constructionStatus = true;
      } else {
        constructionStatus = false;
      }

      //create bindpopup html elements
      const container = document.createElement("div");

      const nameEl = document.createElement("h4");
      nameEl.innerHTML = `${name}`;
      const originEl = document.createElement("h5");
      originEl.innerHTML = `Built in: ${origin}`;
      const statusEl = document.createElement("h5");
      statusEl.innerHTML = `Status: ${status}`;

      const imageEl = document.createElement("img");
      imageEl.setAttribute("src", image);
      imageEl.style.height = "200px";
      imageEl.style.width = "300px";

      //start creating bootstrap offcanvas button
      const stallsButton = document.createElement("button");
      stallsButton.classList.add("btn", "btn-primary"); //Use the classList.add() method to add one or more classes to the element.
      stallsButton.setAttribute("id", "see-stalls-button"); // Set id attribute on the element
      stallsButton.setAttribute("data-bs-toggle", "offcanvas"); //below 3 lines are to use Bootstrap offcanvas
      stallsButton.setAttribute("data-bs-target", "#offcanvasBottom");
      stallsButton.setAttribute("aria-controls", "offcanvasBottom");
      stallsButton.innerText = "What should I eat?";

      // Create Bootstrap offcanvas container element
      const offcanvasContainer = document.createElement("div");
      offcanvasContainer.setAttribute("class", "offcanvas offcanvas-bottom");
      offcanvasContainer.setAttribute("tabindex", "-1");
      offcanvasContainer.setAttribute("id", "offcanvasBottom");
      offcanvasContainer.setAttribute(
        "aria-labelledby",
        "offcanvasBottomLabel"
      );

      // Create Bootstrap offcanvas header element
      const offcanvasHeader = document.createElement("div");
      offcanvasHeader.setAttribute("class", "offcanvas-header");
      offcanvasHeader.style.backgroundColor = "#FFEBB9";

      // Create Bootstrap offcanvas title element
      const offcanvasBodyButton = document.createElement("button");
      offcanvasBodyButton.setAttribute("class", "btn btn-success btn-lg");
      offcanvasBodyButton.innerHTML = "Help me decide what to eat";
      offcanvasHeader.appendChild(offcanvasBodyButton);
      // offcanvasBody.appendChild(offcanvasBodyButton);
      // offcanvasTitle.setAttribute("class", "offcanvas-title");
      // offcanvasTitle.setAttribute("id", "offcanvasBottomLabel");
      // offcanvasTitle.textContent = "Help me decide what to eat";

      // Create close button element
      const closeButton = document.createElement("button");
      closeButton.setAttribute("type", "button");
      closeButton.setAttribute("class", "btn-close");
      closeButton.setAttribute("data-bs-dismiss", "offcanvas");
      closeButton.setAttribute("aria-label", "Close");

      // Append offcanvasTitle and closeButton to offcanvasHeader
      // offcanvasHeader.appendChild(offcanvasTitle);
      offcanvasHeader.appendChild(closeButton);

      // Create offcanvas body element
      const offcanvasBody = document.createElement("div");
      offcanvasBody.setAttribute("class", "offcanvas-body small");
      offcanvasBody.style.backgroundImage =
        "url('img/NHB_HC_Roots Page Banner.jpg')";
      // offcanvasBody.innerHTML =
      //   "Here are some of the stalls in this Hawker Center";

      //create a button in offcanvas body
      // const offcanvasBodyButton = document.createElement("button");
      // offcanvasBodyButton.setAttribute("class", "btn btn-success btn-lg");
      // offcanvasBodyButton.innerHTML = "Click me";
      // offcanvasBody.appendChild(offcanvasBodyButton);

      offcanvasBodyButton.addEventListener("click", async () => {
        const singaporeBounds = {
          north: 1.472361,
          south: 1.24403,
          west: 103.807216,
          east: 104.026119,
        };
        // Generate a random coordinate within Singapore boundaries
        const lat = (
          Math.random() * (singaporeBounds.north - singaporeBounds.south) +
          singaporeBounds.south
        ).toFixed(4);
        const lng = (
          Math.random() * (singaporeBounds.east - singaporeBounds.west) +
          singaporeBounds.west
        ).toFixed(4);
        // call FSQ API to get random location
        let data = await loadData(lat, lng);
        console.log(data);
        let i = Math.floor(Math.random() * 10);
        let randomChoice = data.results[i].name;
        console.log(randomChoice);

        // display the randomContainer in offcanvas body
        const randomContainer = document.createElement("div");
        randomContainer.setAttribute(
          "class",
          "row col-sm-4 col-md-6 col-lg-3 card"
        );
        randomContainer.setAttribute(
          "style",
          "display: flex; justify-content: center; align-items: center; margin: auto;"
        );
        const cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.innerText = "How about ...";
        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        const cardBlockquote = document.createElement("blockquote");
        cardBlockquote.setAttribute("class", "blockquote mb-0");
        const blockquoteP = document.createElement("p");
        blockquoteP.innerHTML = "test test test";

        randomContainer.append(cardHeader, cardBody);

        offcanvasBody.appendChild(randomContainer);

        // offcanvasBodyButton.setAttribute("data-bs-dismiss", "offcanvas");
      });

      // Append offcanvasHeader and offcanvasBody to offcanvasContainer
      offcanvasContainer.appendChild(offcanvasHeader);
      offcanvasContainer.appendChild(offcanvasBody);

      // Append button and offcanvasContainer to document body
      document.body.appendChild(stallsButton);
      document.body.appendChild(offcanvasContainer);

      container.append(imageEl, nameEl, statusEl, originEl, stallsButton);
      console.log(container);

      layer.bindPopup(container);
      // layer.bindPopup(feature.properties.Description); this is for testing
    }

    // Define the filtering function
    function filterFeatures(feature) {
      if (feature.properties && feature.properties.Description) {
        return feature.properties.Description.includes("Construction");
      }
      return false;
    }

    // Create the GeoJSON layer and add to targeted markerclusterGroup for the filtered features
    let filteredClusterGroup = L.markerClusterGroup();
    L.geoJSON(hawkerGeoJson.data, {
      filter: filterFeatures,
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        console.log("construction status: " + constructionStatus);

        // create generic variables to reference the layer group and icon type depending on construction status
        // let iconType;

        // if (constructionStatus == true) {
        //   iconType = myIconUC;
        // } else {
        //   iconType = myIcon;
        // }

        return L.marker(latlng, { icon: myIconUC });
      },
    }).addTo(filteredClusterGroup);

    // Create the GeoJSON layer and add to targeted markerclusterGroup for the non-filtered features
    let nonFilteredClusterGroup = L.markerClusterGroup();
    L.geoJSON(hawkerGeoJson.data, {
      filter: function (feature) {
        return !filterFeatures(feature);
      },
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        console.log("construction status: " + constructionStatus);
        return L.marker(latlng, { icon: myIcon });
      },
    }).addTo(nonFilteredClusterGroup);

    let overlayMaps = {
      "Hawker Centers Under Construction ": filteredClusterGroup,
      "Existing Hawker Centers": nonFilteredClusterGroup,
    };

    L.control.layers(overlayMaps, null, { position: "topleft" }).addTo(map);

    // Add the default view markerclustergroups to the map
    nonFilteredClusterGroup.addTo(map);
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

        window.addEventListener("click", function () {
          resultElement.innerText = "";
        });

        //make the itme clickable
        resultElement.addEventListener("click", function () {
          document.querySelector("#landing-page").style.zIndex = "-1";

          let coordinate = [result.LATITUDE, result.LONGITUDE];

          //add marker to searchResultLayer
          let marker = L.marker(coordinate, { icon: pinIcon }).addTo(
            searchResultLayer
          );

          document
            .querySelector("#clear-icon")
            .addEventListener("click", function () {
              searchResultLayer.clearLayers();
            });

          //customize bindpopup
          let customPopup = `<p>${result.ADDRESS}</p>`;
          let customOptions = {
            className: "popupCustom", //give it class name to customize in style.css
          };
          marker.bindPopup(customPopup, customOptions);
          map.flyTo(coordinate, 16);
        });
      }
    });
}

//search bar on the map page
let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector("#search-icon");

searchInput.addEventListener("keyup", async function () {
  document.querySelector("#search-results").innerHTML = "";

  let response = await getAddress(searchInput.value);

  // let seen = set();
  // try {
  //   for (let result of response.results) {
  //     if (result.SEARCHVAL in seen) {
  //       continue;
  //     } else {
  //       seen.add(result.SEARCHVAL);
  //     }

  let newResult = [];
  try {
    for (let result of response.results) {
      if (newResult.includes(result.SEARCHVAL)) {
        continue;
      } else {
        newResult.push(result.SEARCHVAL);
      }

      let coordinate = [result.LATITUDE, result.LONGITUDE];
      let resultElement = document.createElement("div");
      resultElement.classList = "search-result";
      resultElement.innerHTML = result.SEARCHVAL;
      console.log(resultElement);
      document.querySelector("#search-results").appendChild(resultElement);

      resultElement.addEventListener("click", function () {
        searchResultLayer.clearLayers();
        document.querySelector("#search-results").innerHTML = "";
        L.marker(coordinate, { icon: pinIcon }).addTo(searchResultLayer);
        map.flyTo(coordinate, 16);
      });
    }
  } catch (e) {
    console.log(e);
    console.log("ex ->", response);
  }
});

//add form validation

// adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
