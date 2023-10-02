import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const config = {
    params: { appid: "7757fc7fd537737ec0ef10a2f5a3d118" }
  };

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// render index.ejs as home page
app.get("/", (req, res) => {
    res.render("index.ejs");
});

//render help.ejs as a help page
app.get("/help", (req, res) => {
  res.render("help.ejs");
});

//API USED
//1. TIME API -> GIVE TIME BASED ON LATITUDE AND LONGITUDE
//2. CURRENT WEATHER - OPEN WEATHER API -> CURRENT WEATHER
//3. FIVEDAYS-3HOUR FORECAST - OPEN WEATHER API

app.post("/get-forecast", async (req, res) => {
// RECEVING LATITUDE AND LONGITUDE FROM THE USER
    const searchLatitude = req.body.latitude;
    const searchLongitude = req.body.longitude;
    const location = searchLatitude + ", " + searchLongitude
    console.log(searchLatitude);
    console.log(searchLongitude);
    console.log(location);

    

    try {
      const currentHourJSON = await axios.get(`https://timeapi.io/api/Time/current/coordinate?latitude=${searchLatitude}&longitude=${searchLongitude}`)
      const currentForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
      const fiveHourForecastJSON = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${searchLatitude}&lon=${searchLongitude}&units=metric`, config);
      res.render("index.ejs", { 
        currentContent: currentForecastJSON.data,
        fiveHourContent: fiveHourForecastJSON.data, 
        currentHour: currentHourJSON.data,
        map: location,

      });
    } catch (error) {
      res.render("index.ejs", { currentContent: error.response.data,fiveHourContent: error.response.data   });
    }
  });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

