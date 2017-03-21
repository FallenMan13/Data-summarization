var express = require("express");
var request = require("request");
var app = express();

app.get("/", function(req, res){
  res.send("Hello World!")
})

app.listen(3000, function(){
  console.log("Example app listening on port 3000!")
})

request({
  method: "GET",
  uri: "http://localhost:3000/"
}, function(error, response, body){
  if(error || response.statusCode != 200){
    console.log(JSON.stringify(body, null, 2));
    return;
  }
  else{
    console.log(JSON.stringify(body, null, 2));
    return;
  }
})
