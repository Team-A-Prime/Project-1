/**
 * @file: app.js
 * @authors: jacob hegna <jacobhegna@gmail.com
 * @date: September 2017
 * @brief: Initializationa nd entry point of the server
 */

const express       = require('express');
const bodyParser    = require('body-parser');

const Database      = require('./database.js');
const Event         = require('./event.js');

/**
 * Anonymous main function
 * @pre: nothing
 * @post: the server has stopped running
 * @return: nothing
 */
/* main */ (() => {

    let app      = express();
    let database = new Database('storage/events.db');

    // Set up body-parser in the Express app
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Set up routing
    app.use(express.static('./public'))

    // API for creating a new event
    app.post('/api/events/new', function(req, res) {
        let event = new Event();

        event.name        = req.body.name;
        event.description = req.body.description;

        /* todo: ensure these attrs are formatted correctly */
        // event.time_slots  = JSON.parse(req.body.time_slots);
        // event.attendees   = JSON.parse(req.body.attendees);

        // database.write_event(event)

        res.redirect('/create/');
    });

    // API for getting the current list of events
    app.get('/api/events', function(req, res) {
        database.read_events(function(events) {
            res.send(events);
        });
    });

    // Start the server
    app.listen(8080);

})(); // end of anononymous main
