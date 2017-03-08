module.exports.summarizeData = function summarizeData(initArr, sumArr){ // Function to summarize the collected data and remove any duplicates which may arise
  var total_time = 0;
  var total_count = 0;
  var junk = []; // Array for unnecessary duplicate data
  var count = 0; // Counter for while loops
  var time = []; // Array to hold all elapsed_time values to perform Math.max/min operations on
  while(count <= initArr.length){ // A while loop will help to ensure that the resulting array has looped through all of the data present in the initial array of data, rather than ending prematurely
    for(var i = 0, j = 1; i < initArr.length, j < initArr.length; j++){
      var Arr1 = initArr[i]; // Establish a static array pointer
      var Arr2 = initArr[j]; // Establish a moving array pointer
      if(j === i){} // Empty if to prevent matching and splicing on the same position in the array
      else if(Arr1["label"] === Arr2["label"]){ // If the label of the moving array pointer exactly matches the label of the static array pointer
        time.push(Arr2["elapsed_time"]); // Push the elapsed_time value of the moving array pointer into the time array
        total_time += Arr2["elapsed_time"]; // Add the elapsed_time value of the moving array pointer to the sum variable total_time
        total_count += Arr2["count"]; // Add the count value of the moving array pointer to the sum variable total_count
        junk.push(initArr.splice(j, 1)); // Splice out the matching data found at the moving array pointer's position to a junk array
        j--; // Decrement the moving array pointer to ensure that no matches are missed by accidentally skipping over them after a splice operation
      }
      else if(j === (initArr.length - 1)){ // If the moving array pointer has reached the end of the array
        time.push(Arr1["elapsed_time"]); // Push the elapsed_time value of the static array pointer into the time array
        total_time += Arr1["elapsed_time"]; // Add the elapsed_time value of the static array pointer to the sum variable total_time
        total_count += Arr1["count"]; // Add the count value of the static array pointer to the sum variable total_count
        sumArr.push({ // Push the summarized data into the summary array
          "label" : Arr1["label"],
          "total_elapsed_time" : total_time,
          "average_elapsed_time" : Math.round(total_time/total_count), // Set the average_elapsed_time value to be equal to a rounded result of the division of total_time by total_count
          "min_elapsed_time" : Math.min(... time), // Perform a Math.min operation to fetch the smallest time from the time array
          "max_elapsed_time" : Math.max(... time), // Perform a Math.max operation to fetch the largest time from the time array
          "total_count" : total_count
        })
        junk.push(initArr.splice(i, 1)); // Splice out the data being used to compare the labels of the moving array pointer to prevent any possible fake matches when the loop starts again
        i--; // Decrement the static array pointer to ensure that it points to the correct location after incrementing
        i++; // Increment the static array pointer
        j = 0; // Set the moving array pointer to 0 to catch any potential matches before the static array pointer
        // (note: without the empty if this would result in i and j being at the same position and splicing due to a match being found, thus resulting in a complete loss of data)
        total_time = 0;
        total_count = 0;
        average_time = 0;
        time = []; // Clear the time array of all data to help ensure accurate min and max times for each label group
      }
    }
    count++;
  }
  count = 0; // Set count back to 0 for second while loop
  while(count < sumArr.length){ // While loop to ensure that no duplicate data has been created by the previous loop
    for(var i = 0, j = 1, l = 0; i < sumArr.length, j < sumArr.length; j++){
      if(j === i){} // Empty if to prevent matching and splicing on the same position in the array
      else if(sumArr[i]["label"] === sumArr[j]["label"]){ // If the label of the static array pointer is exactly equal to that of the moving array pointer
        console.log("Match found at position " + j)
        fixSummaryArr(sumArr, i, j); // Run the function to fix the data at the statc pointer and remove the duplicate instance at the moving pointer
        j--;
      }
      else if(j === (sumArr.length - 1)){ // If the moving array pointer has reached the end of the array
        if(sumArr[i]["label"] === sumArr[j]["label"]){ // If the label of the static array pointer is exactly equal to that of the moving array pointer
          console.log("Match found at position " + j)
          fixSummaryArr(sumArr, i, j);
          j--;
        }
        else{
          i++;
          j = 0;
        }
      }
    }
    count++;
  }
  return sumArr; // Return the summary array back to the "resultHandling" module with all duplicate data removed leaving only the summarized data
}

function fixSummaryArr(sumArr, i, j){ // Function to add duplicate data to main entry, recalculate averages and check min and max elapsed times against duplicate to ensure these values are correct/corrected
  var junk = [];
  sumArr[i]["total_elapsed_time"] += sumArr[j]["total_elapsed_time"];
  sumArr[i]["total_count"] += sumArr[j]["total_count"];
  sumArr[i]["average_elapsed_time"] = Math.round(sumArr[i]["total_elapsed_time"]/sumArr[i]["total_count"]);
  if(sumArr[i]["min_elapsed_time"] > sumArr[j]["min_elapsed_time"]){ // If the min_elapsed_time value at the static array pointer is greater than that of the moving array pointer
    sumArr[i]["min_elapsed_time"] = sumArr[j]["min_elapsed_time"]; // Set the min_elapsed_time value of the static array pointer to be equal to the value of the moving array pointer
  }
  else if(sumArr[i]["max_elapsed_time"] < sumArr[j]["max_elapsed_time"]){ // If the max_elapsed_time value at the static array pointer is less than that of the moving array pointer
    sumArr[i]["max_elapsed_time"] = sumArr[j]["max_elapsed_time"]; // Set the max_elapsed_time value of the static array pointer to be equal to the value of the moving array pointer
  }
  junk.push(sumArr.splice(j, 1)); // Splice duplicate data out of the array after all of the relevant data has been extracted
}
