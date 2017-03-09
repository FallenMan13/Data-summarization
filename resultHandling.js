// Required modules
const page = require("./getPage");
const summary = require("./dataSummary");
const index = require("./indexData");
var resArr = []; // Array to hold the response from the "getPage" module requests
var collected = 0;
module.exports.handleResults = function handleSearchResults(error, response, body){ // Function to push data collected from the request into an array
  if(error || response.statusCode != 200){ // If an error was encountered, or if the response code recieved was not 200 OK
    console.log("Got an error: ", JSON.stringify(body, null, 2)); // Stringify the body of the response and output it to the console
    return;
  }
  var res = body.hits.hits;
  //console.log("Got " + (collected += res.length) + " results of " + body.hits.total);
  console.log((collected += res.length) + " / " + body.hits.total/* + "\n"*/)
  res.forEach(function(re){
    if(re._source.label != undefined){ // Only push data to the array if the label is not undefined i.e only push data which exists to the array
      resArr.push({
        "label" : re._source.label,
        "elapsed_time" : re._source.elapsed_time,
        "count" : re._source.count,
      });
    }
  });
  if(res.length != 0){ // If there are still more pages to retrieve
    page.getPage(body._scroll_id); // Call the "getPage" module again with the scroll id as a parameter
  }
  else{ // Otherwise if there are no more pages to retrieve
    var groupedArr = [];
    summary.summarizeData(resArr, groupedArr); // Send the initial array and the summary array to the "dataSummary" module to summarize and store the data from the initial array
    console.log("Total records: " + groupedArr.length);
    index.indexData(groupedArr); // Send the array of summary data to the "indexData" module to attempt an index operation
  }
}
