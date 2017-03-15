// Required modules
var ProgressBar = require("progress");
var fs = require("fs");
const page = require("./getPage");
const summary = require("./dataSummary");
const index = require("./indexData");
var resArr = []; // Array to hold the response from the "getPage" module requests
//var currbar = null; // Create progress bar variable to be set on first module call
module.exports.handleResults = function handleSearchResults(error, response, body){ // Function to push data collected from the request into an array
  if(error || response.statusCode != 200){ // If an error was encountered, or if the response code recieved was not 200 OK
    console.log("Got an error: ", JSON.stringify(body, null, 2)); // Stringify the body of the response and output it to the console
    return;
  }
  var res = body.aggregations;
  /*if(!currbar){ // if the progress bar does not exist yet i.e. currbar is still null
    currbar = new ProgressBar('  Retrieving [:bar] retrieved: :current | total: :total | % complete: :percent | elapsed time: :elapseds | time remaining: :etas', { // Create a new progress bar with the following options
        complete: '#'
      , incomplete: '-'
      , width: 20
      , total: body.hits.total
    });
  }*/
  res.data_labels.buckets.forEach(function(re){
    resArr.push({
      "label" : re.key,
      "total_elapsed_time" : re.data_stats.sum,
      "average_elapsed_time" : re.data_stats.avg,
      "min_elapsed_time" : re.data_stats.min,
      "max_elapsed_time" : re.data_stats.max,
      "total_count" : re.doc_count,
    });
  });
  if(resArr.length > 0){ // If data is present within the array
    console.log("\nData collection complete");
    console.log("Total records: " + resArr.length)
    index.indexData(resArr);
  }
  else{ // If there was no data pushed to the array
    console.log("Data collection failed, no data could be found between the specified dates. Please try again."); // Inform the user that no data could be retrieved from the entered date range
    return; // End operation of the program
  }
}
