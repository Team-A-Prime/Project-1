const express       = require('express');
const app           = express();

const Database      = require('./database.js');
const Event         = require('./event.js');


var test_event = new Event();
test_event.name = "Georgia State University";
test_event.description = "Debate tournament";
test_event.time_slots = [0, 1, 2, 5, 46];
test_event.attendees = ["Jacob", "Henry"];

app.get('/', function(req, res) {
    res.send('Hello, world!');
});

var db = new Database('test.db');
db.write_event(test_event);

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});