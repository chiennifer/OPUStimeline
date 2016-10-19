var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.resolve("./Users/Jennifer/Desktop/OPUS/basicGraphV1.html")));

app.get('/', function(req, res) {
res.sendFile('basicGraphV1.html', { root: __dirname });
});

var port = process.env.PORT || 8000;
var server = app.use(express.static(__dirname));
app.listen(port);
