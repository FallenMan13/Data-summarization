// Required modules
var request = require("request");
const read  = require("readline");
const config = require("./config");
const created = require("./createdDate");
module.exports.indexData = function indexData(data){
  const rlindexuri = read.createInterface({ // Interface to allow the user to input a uri for indexing to
    input: process.stdin,
    output: process.stdout
  })
  function index(questionText, callback){ // Function to allow the user to input the desired uri to index the data to
    function analyzeAnswer(answer){
      rlindexuri.question("Is this uri correct? " + config["base_index_uri"] + answer + " ", function(confirm){
        if(confirm.toLowerCase().startsWith("y")){
          rlindexuri.close();
          callback(answer); // Begin indexing the data to the specified uri
        }
        else if(confirm.toLowerCase().startsWith("n")){
          indexData(data); // Retry entry of the uri
        }
        else{
          console.log("Unsure what you mean by " + confirm + " please try again"); // Default response to input which doesn't match expected values
          rlindexuri.question(questionText, analyzeAnswer); // Retry entry of the uri
        }
      })
    }
  rlindexuri.question(questionText, analyzeAnswer);
  }
  index("Please enter the uri you would like to index to, " + config["base_index_uri"] /*Default uri to speed up uri input i.e. the user need only input the index and type*/, function(answer){ // Function to index the summarized data
    for(var i = 0; i < data.length; i++){ // For loop to index the data individually i.e. each entry in the array will be indexed on its own to allow for easier viewing in kibana
      console.log("Preparing to index the data");
      config.defaultRequest.uri = config["base_index_uri"] + answer;
      config.defaultRequest.body = JSON.stringify(({"@timestamp" : created.createdOn(), "summary" : data[i]}), null, 2)
      request(config.defaultRequest, function(error, response){
        if(error){
          console.log(error);
        }
        else if(response.statusCode === 404){ // If the response code from the index operation is 404 Not Found
          console.log(JSON.stringify(response, null, 2)); // Stringify the response and log it to the console
        }
      });
    }
    console.log("Indexing complete");
  })
}
