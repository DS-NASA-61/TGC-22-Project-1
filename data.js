const FSQ_API_Key = "fsq386YoghWjLs+O6HtXfUIABeRg10pffdXqrOsWxWvyxQA=";

//get fsq API
async function loadData(lat, lng, query) {
  let response = await axios.get(
    "https://api.foursquare.com/v3/places/search",
    {
      headers: {
        Accept: "application/json",
        Authorization: FSQ_API_Key,
      },
      params: {
        query: query,
        ll: lat + "," + lng,
        limit: 50,
        radius: 20000,
      },
    }
  );
  return response.data;
}

//getting hawark center closure date and name data from csv
async function loadHawkerData() {
  let csvHawkerData = await axios.get("dates-of-hawker-centres-closure.csv");
  let jsonHawkerData = await csv().fromString(csvHawkerData.data);
  console.log(jsonHawkerData);
  return jsonHawkerData;
}