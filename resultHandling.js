// Required modules
const page = require("./getPage");
const summary = require("./dataSummary");
const index = require("./indexData");
//var fs = require("fs");
var resArr = []; // Array to hold the response from the "getPage" module requests
module.exports.handleResults = function handleSearchResults(error, response, body){ // Function to push data collected from the request into an array
  if(error || response.statusCode != 200){ // If an error was encountered, or if the response code recieved was not 200 OK
    console.log("Got an error: ", JSON.stringify(body, null, 2)); // Stringify the body of the response and output it to the console
    return; // Don't attempt to run the rest of the function
  }
  var res = body.hits.hits;
  console.log("Got " + res.length + " results");
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
    var date = new Date();
    summary.summarizeData(resArr, groupedArr); // Send the initial array and the summary array to the "dataSummary" module to summarize and store the data from the initial array
    console.log("Total records: " + groupedArr.length);
    /*fs.writeFile("Data Summary " + date.getFullYear() + "-" + ('0' + String(date.getMonth()+1)).substr(-2) + "-" + ('0' + String(date.getDate())).substr(-2) + " @ " + ('0' + String(date.getHours())).substr(-2) + ";" + ('0' + String(date.getMinutes())).substr(-2) + ";" + ('0' + String(date.getSeconds())).substr(-2) + ".txt", JSON.stringify(groupedArr, null, 2), function(){
      console.log("Data Saved");
    })*/ // writeFile purely to check if the array resulting from the "dataSummary" module is as expected
    index.indexData(groupedArr); // Send the array of summary data to the "indexData" module to attempt an index operation
  }
}
