// Required modules
var request = require("request");
const config = require("./config");
const handle = require("./resultHandling");
module.exports.getPage = function getPage(scrollId, JSONrequest){ // Function to send requests for the data between the date range specified earlier
  if(scrollId === undefined){ // If the first page has not been retrieved yet
    console.log("Retrieving first page");
    JSONrequest.from = 0;
    config.defaultRequest.uri = "http://10.156.24.35:5601/elasticsearch/jmeter-*/_search?scroll=1m";
    config.defaultRequest.body = JSONrequest; // Send the altered JSON body as the body for the request
    request(config.defaultRequest, handle.handleResults); // Sends the request and calls the "resultHandling" module to work with the response
  }
  else{ // Otherwise if the first page has been retrieved
    console.log("Retrieving next page");
    config.defaultRequest.uri = "http://10.156.24.35:5601/elasticsearch/_search/scroll";
    config.defaultRequest.body = {"scroll" : "1m", "scroll_id" : scrollId}; // Send the scroll id as the body for the request
    request(config.defaultRequest, handle.handleResults); // Sends the request and calls the "resultHandling" module to work with the response
  }
}
