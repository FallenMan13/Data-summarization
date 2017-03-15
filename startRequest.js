// Required modules
const read  = require("readline");
const program = require("commander");
const page = require("./getPage");
const rlinterface = read.createInterface({ // Interface to allow the user to either use the default dates, or enter their own
  input: process.stdin,
  output: process.stdout
});
module.exports.beginRequest = function beginRequest(JSONrequest){ // Function to allow the user to decide to use the default dates or enter their own
var JSONtimerange = JSONrequest.query.bool.must[1].range["@timestamp"];
  program
      .version('0.0.1')
      .option('-f, --from [date]', 'Start from entered date')
      .option('-t, --to [date]', 'End at entered date')
      .option('-s, --source [uri]', 'Retrieve data from specified uri')
      .option('-i, --index [uri]', 'Index at specified uri')
      .parse(process.argv);
  if(process.argv.length >= 6 && (isNaN(Date.parse(program.from)) === false && isNaN(Date.parse(program.to)) === false)){
      console.log("You selected the date range of: ");
      if(program.from) console.log("From " + program.from);
      if(program.to) console.log("To " + program.to);
      if(!program.source){
        console.log("No source uri was selected, you will be prompted to enter this shortly");
      }
      else if(program.source){
        console.log("With a source uri of: ");
        console.log("Source uri: " + program.source);
      }
      if(!program.index){
        console.log("No index uri was selected, you will be prompted to enter this at a later stage\n");
      }
      else if(program.index){
        console.log("With an index uri of: ")
        console.log("Index uri: " + program.index + "\n");
      }
      JSONtimerange.gte = Date.parse(program.from);
      JSONtimerange.lte = Date.parse(program.to);
      rlinterface.close();
      page.getPage(JSONrequest);
  }
  else{
    program.outputHelp();
    if((!program.from || isNaN(Date.parse(program.from)) === true) || (!program.to || isNaN(Date.parse(program.to)) === true)){
      console.log("In order to begin searching for data using the command line parameters, both the start and end date must be specified and must be numbers")
    }
    var date = new Date();
    // Automatic creation of default dates
    var currDate = date.getFullYear() + "-" + ('0' + String(date.getMonth()+1)).substr(-2) + "-" + ('0' + String(date.getDate())).substr(-2) + "T";
    var midNight = currDate + "00:00:00.000Z"; // Append the current date with midnight as the time
    var morning1 = currDate + "01:00:00.000Z"; // Append the current date with 1 in the morning as the time
    function defaults(questionText, callback){ // Function to confirm if the default dates should be used
      function analyzeAnswer(answer){
        if(answer.toLowerCase().startsWith("y")){ // If the response entered begins with a 'y' when converted to lowercase
          rlinterface.close();
          callback(answer); // Parses the default dates into the JSON body and sends it to the "getpage" module
        }
        else if(answer.toLowerCase().startsWith("n")){ // If the response entered begins with an 'n' when converted to lowercase
          dateRange(JSONrequest); // Passes the JSON body to the dateRange function for the user to input the dates to be used
        }
        else{
          console.log("Unsure what you mean by " + answer + " please try again"); // Default response to input which doesn't match expected values
          rlinterface.question(questionText, analyzeAnswer); // Retry the question
        }
      }
      rlinterface.question(questionText, analyzeAnswer);
    }
    defaults("Would you like to use the default dates: " + midNight + " to " + morning1 + "? ", function(answer){ // Function to parse the defailt dates into the JSON body
      rlinterface.close();
      JSONtimerange.gte = Date.parse(midNight); // Parse the first default date into epoch milliseconds and store in the JSON body
      JSONtimerange.lte = Date.parse(morning1); // Parse the second default date into epoch milliseconds and store in the JSON body
      page.getPage(JSONrequest); // Send the altered JSON body to the "getPage" module
    })
  }
}
var counter = 0;
function dateRange(JSONrequest){ // Function to allow the user to enter a date range to search with
var JSONtimerange = JSONrequest.query.bool.must[1].range["@timestamp"];
  var qstntxt = ["Please enter the first date in the format 'yyyy-mm-ddThh:mm:ss.mmmZ' ", "Please enter the second date in the same format "]; // Array of question text
  function dates(questionText, callback){ // Function to allow the user to input 2 dates with confirmation
    function analyzeAnswer(answer){
      if(IsNaN(Date.parse(answer)) === true){
        console.log("The entered date is invalid, please try again");
        dateRange(JSONrequest);
      }
      else{
        rlinterface.question("Is this date correct? " + answer + " ", function(confirm){
          if(confirm.toLowerCase().startsWith("y")){ // If the response entered begins with a 'y' when converted to lowercase
            callback(answer); // Parses the entered date into the JSON body
          }
          else if(confirm.toLowerCase().startsWith("n")){ // If the response entered begins with an 'n' when converted to lowercase
            dateRange(JSONrequest); // Retries the current date entry
          }
          else{
            console.log("Unsure what you mean by " + confirm + " please try again"); // Default response to input which doesn't match expected values
            rlinterface.question(qstntxt[counter], analyzeAnswer); // Retry the current question
          }
        })
      }
    }
    rlinterface.question(qstntxt[counter], analyzeAnswer);
  }
  dates(qstntxt[counter], function(answer){ // Function to parse the entered dates into the JSON body and send it to the "getPage" module
    if(counter === 0){ // If the first question has been asked
      JSONtimerange.gte = Date.parse(answer); // Parse the entered date into epoch milliseconds and store in the JSON body as the starting date
      counter++; // Increment the counter to output the second question in the array
      dateRange(JSONrequest); // Run the function again to enter the second date
    }
    else if(counter === 1){ // If the second question has been asked
      rlinterface.close();
      JSONtimerange.lte = Date.parse(answer); // Parse the entered date into epoch milliseconds and store in the JSON body as the ending date
      page.getPage(JSONrequest); // Send the altered JSON body to the "getPage" module
    }
  })
}
