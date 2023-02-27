const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup().addTo(map);
let stallsSearchResultLayer = L.layerGroup().addTo(map);
// let markerClusterGroup = L.markerClusterGroup().addTo(map);

let constructionStatus;

// let existingLayer = {
//   "Existing Hawker Centers": markers,
// };

// let underConstructionLayer = {
//   "Hawker Centers Under Construction": markersUnderConstruction,
// };

// L.control.layers(existingLayer, underConstructionLayer).addTo(map);

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

      const nameEl = document.createElement("h2");
      nameEl.innerHTML = `${name}`;
      const originEl = document.createElement("h4");
      originEl.innerHTML = `${origin}`;
      const statusEl = document.createElement("h4");
      originEl.innerHTML = `status : ${status}`;

      const imageEl = document.createElement("img");
      imageEl.setAttribute("src", image);
      imageEl.style.border = "5px solid yellow";
      imageEl.style.height = "350px";
      imageEl.style.width = "550px";

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

      // Create Bootstrap offcanvas title element
      const offcanvasTitle = document.createElement("h5");
      offcanvasTitle.setAttribute("class", "offcanvas-title");
      offcanvasTitle.setAttribute("id", "offcanvasBottomLabel");
      offcanvasTitle.textContent = "Offcanvas bottom";

      // Create close button element
      const closeButton = document.createElement("button");
      closeButton.setAttribute("type", "button");
      closeButton.setAttribute("class", "btn-close");
      closeButton.setAttribute("data-bs-dismiss", "offcanvas");
      closeButton.setAttribute("aria-label", "Close");

      // Append offcanvasTitle and closeButton to offcanvasHeader
      offcanvasHeader.appendChild(offcanvasTitle);
      offcanvasHeader.appendChild(closeButton);

      // Create offcanvas body element
      const offcanvasBody = document.createElement("div");
      offcanvasBody.setAttribute("class", "offcanvas-body small");
      offcanvasBody.innerHTML =
        "Here are some of the stills in this Hawker Center";
      offcanvasBody.style.backgroundImage =
        "url('img/NHB_HC_Roots Page Banner.jpg')";

      // Append offcanvasHeader and offcanvasBody to offcanvasContainer
      offcanvasContainer.appendChild(offcanvasHeader);
      offcanvasContainer.appendChild(offcanvasBody);

      // Append button and offcanvasContainer to document body
      document.body.appendChild(stallsButton);
      document.body.appendChild(offcanvasContainer);

      container.append(statusEl, imageEl, nameEl, originEl, stallsButton);
      console.log(container);

      layer.bindPopup(container);
    }

    // Define the filtering function
    function filterFeatures(feature) {
      if (feature.properties && feature.properties.Description) {
        return feature.properties.Description.includes("Construction");
      }
      return false;
    }
    // Filter the features based on the filtering function
    // let filteredFeatures = myFeatures.features.filter(filterFeatures);

    // Create the GeoJSON layer for the filtered features
    let filteredClusterGroup = L.markerClusterGroup();
    let underConstructionLayer = L.geoJSON(hawkerGeoJson.data, {
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

    // Create the GeoJSON layer for the non-filtered features
    let nonFilteredClusterGroup = L.markerClusterGroup();
    let existingLayer = L.geoJSON(hawkerGeoJson.data, {
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
    // let firstLayer = {
    //   "Existing Hawker Centers": existingLayer,
    // };
    // let secondLayer = {
    //   "Hawker Centers Under Construction": underConstructionLayer,
    // };
    L.control.layers(overlayMaps, null, { position: "topleft" }).addTo(map);

    // Add the marker cluster groups to the map by default
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

        //make the itme clickable
        resultElement.addEventListener("click", function () {
          document.querySelector("#landing-page").style.zIndex = "-1";
          // document.location.hash = "#map";

          // resultElement.addEventListener("click", function () {
          // document.querySelector("#map-container").style.zIndex = "6000";
          // document.location.hash = "#map";

          //create marker , customize it and add to searchResultLayer
          // let pinIcon = L.icon({
          //   iconUrl: "img/location.png",
          //   iconSize: [58, 58], // size of the icon
          //   popupAnchor: [0, -15],
          // });
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

// adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
