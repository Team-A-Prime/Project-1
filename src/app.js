const express       = require('express');
const app           = express();

const Database      = require('./database.js');
const Event         = require('./event.js');


app.get('/', function(req, res) {
    res.send('EECS 448 Project 1');
});

app.listen(8080, function() {});