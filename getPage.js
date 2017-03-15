// Required modules
var request = require("request");
const read  = require("readline");
const config = require("./config");
const handle = require("./resultHandling");
module.exports.getPage = function getPage(JSONrequest){ // Function to send requests for the data between the date range specified earlier
  if(process.argv[7] != undefined){ // If a source uri has been supplied as a command line parameter
    sendData(process.argv[7]); // Call the sendData function with the entered parameter as the uri
  }
  else{
    const rluri = read.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    function uri(questionText, callback){
      function analyzeAnswer(answer){
        if(answer.toLowerCase().startsWith("y")){
          rluri.close();
          callback(answer);
        }
        else if(answer.toLowerCase().startsWith("n")){
          rluri.question("Please enter the uri you would like to retrieve data from ", function(uri){
            sendData(config["base_uri"] + uri);
          })
        }
      }
      rluri.question(questionText, analyzeAnswer)
    }
    uri("Would you like to use the default uri of " + config["base_uri"] + "jmeter-*? ", function(answer){
      sendData(config["base_uri"] + "jmeter-*");
    })
  }
  function sendData(uri){
    console.log("Retrieving data");
    JSONrequest.from = 0;
    JSONrequest.size = 0;
    JSONrequest.aggs = {
      "data_labels": {
        "terms": {
          "field": "label.keyword"
        },
        "aggs": {
          "data_stats": {
            "stats": {
              "field": "elapsed_time"
            }
          }
        }
      }
    }
    config.defaultRequest.uri = uri + "/_search";
    config.defaultRequest.body = JSONrequest;
    request(config.defaultRequest, handle.handleResults); // Sends the request and calls the "resultHandling" module to work with the response
  }
}
