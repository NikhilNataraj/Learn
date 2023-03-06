//jshint esversion: 6

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstname = req.body.fname;
  const lastname = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstname,
        LNAME: lastname
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/33ad525cfb";
  const options = {
    method: "POST",
    auth: "NikhilNatarajan:60ba4fe4170b6084a6569a1a56bc81fd-us21"
  }


  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/success", function(req, res) {
  res.redirect("/");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server is running");
})
