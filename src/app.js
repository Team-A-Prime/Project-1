const express = require('express');
const app = express();

const Database = require('./database.js');

var test_data = {
    name: "Georgia State University",
    description: "Debate tournament",
    time_slots: [0, 1, 2, 5, 46],
    attendees: ["Jacob", "Henry"]
};

app.get('/', function(req, res) {
    res.send('Hello, world!');
});

var db = new Database('test.db');
db.write_event(test_data);

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});