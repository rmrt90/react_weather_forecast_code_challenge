/*
|--------------------------------------------------------------------------
| IMPORTING NODES AND UTILITIES
|--------------------------------------------------------------------------
*/

var path = require("path");
var express = require("express");
var cors = require("cors");
var axios = require("axios");


/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/
var app = express();

app.set("host", process.env.NODE_IP || "localhost");
app.use(cors());
app.use(express.static(path.join(__dirname, "/")));
var router = express.Router();


router.get("/getWeatherData/:woeid/:year/:month/:day", function (req, res) {
  var woeid = req.params.woeid.toString();
  var year = req.params.year.toString();
  var month = req.params.month.toString();
  var day = req.params.day.toString();
  try {
    axios
      .get(
        "https://www.metaweather.com/api/location/" + woeid + "/" + year + "/" + month + "/" + day + "/"
      )
      .then(function (response) {
        res.send(response.data);
      });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getTodayWeatherData/:woeid/", function (req, res) {
  var woeid = req.params.woeid.toString();
  try {
    axios
      .get(
        "https://www.metaweather.com/api/location/" + woeid + "/"
      )
      .then(function (response) {
        res.send(response.data);
      });
  } catch (error) {
    console.log(error);
  }
});


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


app.use("/api", router);

app.listen(process.env.PORT || 8080)
