const Singapore = [1.3521, 103.8198]; //leaflet expect lat lng in array, which will be used in the createMap function
const map = createMap(Singapore);
let searchResultLayer = L.layerGroup().addTo(map);
let stallsSearchResultLayer = L.layerGroup().addTo(map);

//define radio button value for FSQ API params category
const coffee = "13032";
const dessert = "13040";
const foodAll = "13000";

let constructionStatus;

//customize GeoJson point markers
const myIcon = L.icon({
  iconUrl: "img/food-stall.png",
  iconSize: [55, 55], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});
// Add media query for mobile screens
const mediaQuery = window.matchMedia("(max-width: 320px)");
if (mediaQuery.matches) {
  myIcon.options.iconSize = [35, 35];
}

//customize GeoJson point markers
const myIconUC = L.icon({
  iconUrl: "img/under-construction.png",
  iconSize: [55, 55], // width and height of the image in pixels
  shadowSize: [35, 20], // width, height of optional shadow image
  iconAnchor: [12, 12], // point of the icon which will correspond to marker's location
  shadowAnchor: [12, 6], // anchor point of the shadow. should be offset
  popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
});

//create marker , customize it and add to searchResultLayer
let pinIcon = L.icon({
  iconUrl: "img/location.png",
  iconSize: [50, 50], // size of the icon
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
      //add media query for mobile screens
      const mediaQuery = window.matchMedia("(max-width: 425px)");
      if (mediaQuery.matches) {
        imageEl.style.height = "auto";
        imageEl.style.width = "100%";
      }

      //start creating bootstrap offcanvas button
      const stallsButton = document.createElement("button");
      stallsButton.classList.add("btn", "btn-success"); //Use the classList.add() method to add one or more classes to the element.
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
      //create radio button using backticks
      //radio coffee
      const radioBtnCoffee = document.createElement("div");
      radioBtnCoffee.setAttribute("class", "form-check form-check-inline");
      const radioBtnCoffeeInput = `<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value=${coffee}>
  <label class="form-check-label" for="inlineRadio1">Coffee&Tea</label>`;
      radioBtnCoffee.innerHTML = radioBtnCoffeeInput;
      offcanvasHeader.appendChild(radioBtnCoffee);
      //radio dessert
      const radioBtnDessert = document.createElement("div");
      radioBtnDessert.setAttribute("class", "form-check form-check-inline");
      const radioBtnDessertInput = `<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value=${dessert}>
  <label class="form-check-label" for="inlineRadio2">Dessert</label>`;
      radioBtnDessert.innerHTML = radioBtnDessertInput;
      offcanvasHeader.appendChild(radioBtnDessert);
      //radio all food choices
      const radioBtnAll = document.createElement("div");
      radioBtnAll.setAttribute("class", "form-check form-check-inline");
      const radioBtnAllInput = `<input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value=${foodAll}>
  <label class="form-check-label" for="inlineRadio3">All</label>`;
      radioBtnAll.innerHTML = radioBtnAllInput;
      offcanvasHeader.appendChild(radioBtnAll);

      const offcanvasBodyButton = document.createElement("button");
      offcanvasBodyButton.setAttribute("class", "btn btn-success btn-md");
      offcanvasBodyButton.innerHTML = "Roll";
      offcanvasHeader.appendChild(offcanvasBodyButton);

      // Create close button element
      const closeButton = document.createElement("button");
      closeButton.setAttribute("type", "button");
      closeButton.setAttribute("class", "btn-close");
      closeButton.setAttribute("data-bs-dismiss", "offcanvas");
      closeButton.setAttribute("aria-label", "Close");

      // Append closeButton to offcanvasHeader
      offcanvasHeader.appendChild(closeButton);

      // Create offcanvas body element
      const offcanvasBody = document.createElement("div");
      offcanvasBody.setAttribute("class", "offcanvas-body small");
      offcanvasBody.style.backgroundImage =
        "url('img/NHB_HC_Roots Page Banner.jpg')";

      offcanvasBodyButton.addEventListener("click", async () => {
        offcanvasBody.innerHTML = "";
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
        const radioValue = document.querySelector(
          'input[name="inlineRadioOptions"]:checked'
        ).value;

        // get value

        // call FSQ API to get random location basis on lat lng and category
        let data = await loadData(lat, lng, radioValue);
        console.log(data);
        let i = Math.floor(Math.random() * 10);
        let randomChoiceName = data.results[i].name;
        console.log(randomChoiceName);

        let randomChoiceAddress;
        if (data.results[i].location.address_extended === undefined) {
          randomChoiceAddress = `${data.results[i].location.formatted_address}`;
        } else {
          randomChoiceAddress = `${data.results[i].location.formatted_address} ${data.results[i].location.address_extended}`;
        }

        // create a card in offcanvas body to display random choice
        const randomContainer = document.createElement("div");
        randomContainer.setAttribute(
          "class",
          "row col-sm-4 col-md-6 col-lg-3 border-success mb-3 card"
        );
        randomContainer.setAttribute(
          "style",
          "display: flex; justify-content: center; align-items: center; margin: auto;"
        );
        const cardHeader = document.createElement("div");
        cardHeader.setAttribute("class", "card-header");
        cardHeader.innerText = "How about ...";
        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body text-success");
        const cardTitle = document.createElement("h5");
        cardTitle.setAttribute("class", "card-title");
        cardTitle.innerText = randomChoiceName;
        const cardText = document.createElement("p");
        cardText.setAttribute("class", "card-text");
        cardText.innerText = randomChoiceAddress;

        cardBody.append(cardTitle, cardText);
        randomContainer.append(cardHeader, cardBody);
        offcanvasBody.appendChild(randomContainer);

        //this line of code is for future improvement: when click, flyto the stall location on the map
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

      layer.bindPopup(container, {
        width: "fit-content",
      });
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
      onEachFeature: function (feature, layer) {
        let el = document.createElement("div");
        el.innerHTML = feature.properties.Description;
        let allTd = el.querySelectorAll("td"); //queryselecterAll returns array

        let origin = allTd[2].innerHTML;
        let name = allTd[19].innerHTML;
        let status = allTd[3].innerHTML;

        //create bindpopup html elements
        const container = document.createElement("div");

        const nameEl = document.createElement("h4");
        nameEl.innerHTML = `${name}`;
        const originEl = document.createElement("h5");
        originEl.innerHTML = `Built in: ${origin}`;
        const statusEl = document.createElement("h5");
        statusEl.innerHTML = `Status: ${status}`;

        container.append(nameEl, statusEl, originEl);

        layer.bindPopup(container);
      },
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

//both "input" and "keyup" would work
searchInput.addEventListener("input", async function () {
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
        console.log("1");
        continue;
      } else {
        newResult.push(result.SEARCHVAL);
        console.log("2");
      }

      let coordinate = [result.LATITUDE, result.LONGITUDE];
      let resultElement = document.createElement("div");
      resultElement.classList = "search-result";
      resultElement.innerHTML = result.SEARCHVAL;
      console.log(resultElement);
      document.querySelector("#search-results").appendChild(resultElement);

      resultElement.addEventListener("click", function () {
        searchInput.value = document.querySelector(".search-result").innerHTML;
        searchResultLayer.clearLayers();
        document.querySelector("#search-results").innerHTML = "";
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
      });
    }
  } catch (e) {
    console.log(e);
    console.log("ex ->", response);
  }
});

//add form validation

function toggleForm() {
  let createAccountForm = document.querySelector("#form-container");
  createAccountForm.style.display =
    createAccountForm.style.display == "none" ? "" : "none";
  return false;
}

// adding DOMContentLoaded event before calling main()
window.addEventListener("DOMContentLoaded", function () {
  main();
});
