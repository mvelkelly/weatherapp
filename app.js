const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");
const app = express();

const rain = ["rain", "thunderstorm", "moderate rain", "light rain", "heavy intensity rain"];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req, res){
  res.render("index");
});



app.post("/", function(req, res){
  const query = req.body.cityName;
  const key = "06107487709d9cb6e0e71848fe83b448";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ key +"&units=metric";
  https.get(url, function(response){
    console.log(response.statusCode);
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const weather = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon        = weatherData.weather[0].icon;
      const weatherUrl  = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
      if(description === "clear sky"){
        res.render("sunny",{
          query: query,
          weather: weather,
          description: description,
          weatherUrl: weatherUrl
        });
      }
      rain.forEach(function(r){
        if(description === r){
          res.render("rain",{
            query: query,
            weather: weather,
            description: description,
            weatherUrl: weatherUrl
          });
        }
      })
        if (description === "snow") {
        res.render("snow",{
          query: query,
          weather: weather,
          description: description,
          weatherUrl: weatherUrl
        });
      } else if(description === "mist") {
        res.render("mist",{
          query: query,
          weather: weather,
          description: description,
          weatherUrl: weatherUrl
        });
      } else {
        res.render("clouds",{
          query: query,
          weather: weather,
          description: description,
          weatherUrl: weatherUrl
        });
      }

    })

  })

})



app.listen(3000, function(req, res){
  console.log("Server is running!");
})
