module.exports.createdOn = function createdOn(){ //Timestamp for created summary data in the format 'yyyy-mm-ddThh:hh:mm:ss.mmmZ'
  var date = new Date();
  var df = date.getFullYear() + "-"
            + ('0' + String(date.getMonth()+1)).substr(-2) + "-"
            + ('0' + String(date.getDate())).substr(-2) + "T"
            + ('0' + String(date.getHours())).substr(-2) + ":"
            + ('0' + String(date.getMinutes())).substr(-2) + ":"
            + ('0' + String(date.getSeconds())).substr(-2) + "."
            + ('0' + String(date.getMilliseconds())).substr(-3) + "Z"; // The combination of '0' and substr(-2)/substr(-3) ensures that the resulting date will always have 2 or 3 digits if the
            // resulting number is less than 10 or 100
  return df.toString();
}
