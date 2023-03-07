# **Hawker Seeker**

![Screenshots of Hawker Seeker homepage](img src="img/Multi Device Website Mockup Generator.png" style="display: block")

Link to demo : [here](https://hawker-seeker.netlify.app/)

## Summary

Hawker Seeker is a mobile-responsive web application that provides users with an interactive map of Hawker centers in Singapore.

Users can see the locations of the Hawker centers as if they were looking down from a bird's eye view, allowing them to easily locate and explore the various food options avalible. The app is designed to be accessible and user-friendly on both desktop and mobile devices, with features such address search, current location, random food option generator, making it easy for locals and tourists alike to discover the rich culinary culture of Singapore's hawker centers.

---

## UI/UX

### User Story / Goals

"As a foodie visiting Singapore for the first time, I want to be able to easily find and explore different Hawker centers, so that I can experience the local cuisine and culture."
With this web app, users can have a complete overview of hawker centers in Singapore and discover hidden gem in lesser-known Hawker centers, save time by quickly locating Hawker centers close to their current location and start exploring the cultural and social aspects of Singapore's Hawker centers, as well as making quick food decision based on the random choice generator feature.

### Structure and Skeleton

![Sitemap](tobe added.jpg)

#### Fonts

_Gilroy,sans-serif_ is a font family that is modern, minimalist style and versatility make it a popular choice for designers and creatives looking for a clean, contemporary font that can work across a range of applications and media. It fits well with the astethic of the website.

---

## Features

## Feature

| Features                                                      | Description                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Search Address by name from landing page                      | This search feature allows users to search for a location, and bring them to the map to see if there are hawkercenters around that location.                                                                                                                                                               |
| Search Address by name from map page                          | This search feature allows users to search for a different location once they are no longer on the landing page.                                                                                                                                                                                           |
| Autocomplete search suggestion                                | This feature is enabled by OneMap API and designed to work with the search feature to provide a dropdown list of address names, which updates dynamically as the user types search query.                                                                                                                  |
| Display Hawker Center information based on marker interaction | Clicking on any of the Hawker Center markers will trigger the display of a popup info box to display basic information about the hawker center, as well as a button to bring user to the random meal generator(please note the random food option feature is a proof of concept only due to lack of data). |
| Display user's current location                               | This feature allows users to locate themselves on the map.                                                                                                                                                                                                                                                 |
| Account Registrition                                          | This feature allows users to create account for the website. The form is designed with validation rules to prevent invalid inputs from being submitted. (Note: Due to the scope of the project, the form submission does not have a backend to handle the post request)                                    |

## Limitations and Future Implementations

1. Enhance the random food option generator feature

   - Current limitation :
     - The food choices are currently randomly generated from the FourSquare Place Search API and not specifily related to the specific Hawker Center due to lack of data.
   - Future implementation :
     - First using reverse GeoCoding to get the lat lng from Hawker Center GeoJSON, and then tab onto a more accurate API which contains food stall information.

2. Provide navigation and polyline route

   - Current limitation :
     - No navigation and polyline route is available .
   - Future implementation :
     - Users are able to select either his/her current location or the search result location as starting point and select a Hawker Center of choice as destination, and display a route of choice, e.g. by car, walking or public transport.

---

## Technologies Used

1. HTML

2. CSS

3. [Bootstrap 5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)

   - Used for buttons, searchbar and offcanvas of website

4. JavaScript

5. [Axios](https://github.com/axios/axios)

   - Used to fetch data from APIs used by website

6. [LeafletJS](https://leafletjs.com/)

   - Used to render interactive map used by website

7. [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)

   - Used to cluster map markers on map

8. [Font Awesome icons](https://fontawesome.com/v4/icons/)

   - Used for icons displayed in the searchbar such as magnifying glass and close button

---

## Testing

The website is tested for responsiveness using Developer Tools on Chrome browser for mobile, tablet and desktop screen widths.
The test cases can be found [here](to be added.pdf).

---

## Deployment

The website is hosted using [Netlify](https://www.netlify.com/), deployed directly from the main branch of this Github repository.
For the detailed deployment steps, you can refer to the blog post on Netlify [here](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/).

---

## Credits and Acknowledgement

### Icons :

1. [Font Awesome](https://fontawesome.com/) - Used in tabs and buttons of website

2. [Flaticon](https://www.flaticon.com/) - Used in map marker icons as well as create account button of website

### Data :

1. [Data.gov.sg](https://data.gov.sg/dataset/hawker-centres)

   - The GeoJSON by National Environment Agency was used to display Hawker Center locations, information and photos on website

2. [FourSquare Place Search API](https://location.foursquare.com/developer/reference/place-search)

   - Used to fetch location and information of food establishments, which is used in the random food choice generator feature

3. [OneMap REST APIs](hhttps://www.onemap.gov.sg/docs/#onemap-rest-apis)

   - Used to search for address names and display the location on the map

### Screenshot :

1. [CreateMockup.com](https://www.createmockup.com/generate/) - Used to generate responsive website mockup for README file
