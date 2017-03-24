var express = require("express");
var bodyParser = require("body-parser");
const config = require("./config");
const jmeter = require("./JmeterDataSummary");
const index = require("./indexData");
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended: false}));
// views is directory for all template files
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(request, response){
  var date = new Date();
  var year_month = date.getFullYear() + "-" + ("0" + String(date.getMonth()+1)).substr(-2) + "-"
  var currdate = ("0" + String(date.getDate())).substr(-2);;
  var start = year_month + "01T00:00";
  var end = year_month + currdate + "T23:59";
  var defaults = {source_uri: "http://10.156.24.35:5601/elasticsearch/jmeter-*", start_date: start, end_date: end, index_uri: "http://10.156.24.35:5601/elasticsearch/perfstats-2017.03.23/summary/", summary_data: "Collected data will be placed here"};
  response.render('pages/index', defaults);
});

app.post("/", function(request, response){
  var outcome = Object.assign(request.body);
  if(config["summary_data"] === undefined){
    outcome["summary_data"] = "Collected data will be placed here";
    config["start_date"] = request.body["start_date"];
    config["end_date"] = request.body["end_date"];
    config["web_source_uri"] = request.body["source_uri"];
    config["web_index_uri"] = request.body["index_uri"];
    jmeter.Start();
    setTimeout(function(){outcome["summary_data"] = JSON.stringify(config["summary_data"], null, 2);
    response.render('pages/index', outcome)}, 1000);
  }
  else{
    outcome["summary_data"] = JSON.stringify(config["summary_data"], null, 2);
    index.indexData(config["summary_data"]);
    response.render('pages/index', outcome);
  }
});

app.listen(app.get("port"), function(){
  console.log("Node app is running on port", app.get("port"));
});
