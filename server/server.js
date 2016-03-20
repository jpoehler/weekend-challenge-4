var express = require('express');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);

app.listen(port, function(){
  console.log('Listening for requests on port', port);
});
