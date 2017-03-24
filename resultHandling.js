// Required modules
const page = require("./getPage");
const summary = require("./dataSummary");
const index = require("./indexData");
const config = require("./config");
var resArr = []; // Array to hold the response from the "getPage" module requests
module.exports.handleResults = function handleSearchResults(error, response, body){ // Function to push data collected from the request into an array
  if(error || response.statusCode != 200){ // If an error was encountered, or if the response code recieved was not 200 OK
    if(body === undefined){
      console.log("Got an error: No body found in the response, please check the uri you are retrieving data from to ensure it is responding to requests as expected");
      return;
    }
    console.log("Got an error: ", JSON.stringify(body, null, 2)); // Stringify the body of the response and output it to the console
    return;
  }
  var res = body.aggregations;
  if(config["web_source_uri"] != undefined){
    var webResArr = [];
    dataCollection(res, webResArr);
  }
  else{
    dataCollection(res, resArr);
  }
  if(resArr.length > 0 || webResArr.length > 0){ // If data is present within the array
    console.log("Data collection complete");
    if(config["web_source_uri"] != undefined){
      config["summary_data"] = webResArr;
      console.log("Total records: " + webResArr.length);
      return;
    }
    else{
      console.log("Total records: " + resArr.length);
      index.indexData(resArr);
    }
  }
  else{ // If there was no data pushed to the array
    console.log("Data collection failed, no data could be found between the specified dates. Please try again."); // Inform the user that no data could be retrieved from the entered date range
    return; // End operation of the program
  }
}

function dataCollection(response, array){
  response.data_labels.buckets.forEach(function(re){
    array.push({
      "label" : re.key,
      "total_elapsed_time" : re.data_stats.sum,
      "average_elapsed_time" : re.data_stats.avg,
      "min_elapsed_time" : re.data_stats.min,
      "max_elapsed_time" : re.data_stats.max,
      "total_count" : re.doc_count,
    });
  });
  return array;
}
