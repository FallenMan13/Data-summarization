// Required modules
var ProgressBar = require("progress")
const page = require("./getPage");
const summary = require("./dataSummary");
const index = require("./indexData");
var resArr = []; // Array to hold the response from the "getPage" module requests
var currbar = null; // Create progress bar variable to be set on first module call
module.exports.handleResults = function handleSearchResults(error, response, body){ // Function to push data collected from the request into an array
  if(error || response.statusCode != 200){ // If an error was encountered, or if the response code recieved was not 200 OK
    console.log("Got an error: ", JSON.stringify(body, null, 2)); // Stringify the body of the response and output it to the console
    return;
  }
  var res = body.hits.hits;
  if(!currbar){ // if the progress bar does not exist yet i.e. currbar is still null
    currbar = new ProgressBar('  Retrieving [:bar] retrieved: :current | total: :total | % complete: :percent | elapsed time: :elapseds | time remaining: :etas', { // Create a new progress bar with the following options
        complete: '#'
      , incomplete: '-'
      , width: 20
      , total: body.hits.total
    });
  }
  res.forEach(function(re){
    if(re._source.label != undefined){ // Only push data to the array if the label is not undefined i.e only push data which exists to the array
      resArr.push({
        "label" : re._source.label,
        "elapsed_time" : re._source.elapsed_time,
        "count" : re._source.count,
      });
    }
  });
  if(currbar.curr != body.hits.total){ // If the current index of the progress bar is less than the total number of records to retrieve
    if(currbar.curr >= body.hits.total - 1000){ // If the current index of the progress bar is within 1000 of the number of records to retrieve
      currbar.tick(body.hits.total - currbar.curr) // Tick using the difference between the total number of results and the current index of the progress bar
    }
    else{
      currbar.tick(1000); // Otherwise tick with 1000
    }
  }
  else if(currbar.curr === body.hits.total){ // If the current index of the progress bar is exactly equal to the total number of results to retrieve
  } // Do nothing and move on to the final else
  if(res.length != 0){ // If there are still more pages to retrieve
    page.getPage(body._scroll_id); // Call the "getPage" module again with the scroll id as a parameter
  }
  else{ // Otherwise if there are no more pages to retrieve
    if(resArr.length > 0){ // If data is present within the array
      console.log("Data collection complete");
      var groupedArr = [];
      summary.summarizeData(resArr, groupedArr); // Send the initial array and the summary array to the "dataSummary" module to summarize and store the data from the initial array
      console.log("Total records: " + groupedArr.length);
      index.indexData(groupedArr); // Send the array of summary data to the "indexData" module to attempt an index operation
    }
    else{ // If there was no data pushed to the array
      console.log("Data collection failed, no data could be found between the specified dates. Please try again."); // Inform the user that no data could be retrieved from the entered date range
      return; // End operation of the program
    }
  }
}
