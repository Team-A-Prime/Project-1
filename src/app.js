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
    let database = new Database('./storage/events.db', function() {
        database.db.parallelize();
    });
    database.db.serialize();

    database.write_event(event);

    database.read_events(function(events) {
        console.log(events);
    });

/*
    let app      = express();
    let database = new Database('storage/events.db');

    // Set up body-parser in the Express app
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Set up routing
    app.use(express.static('./public'))

    // API for creating a new event
    app.post('/api/events/new', function(req, res) {    
        // Parses POST data to built an event
        // returns undefined if parsing failed.
        let parseEvent = (postData, success, failure) => {
            let event = new Event();
            event.name        = req.body.name;
            event.description = req.body.description;
            event.attendees   = new Array(req.body.creator);
            try {
                event.time_slots = JSON.parse(req.body.time_slots);
                if(!Array.isArray(event.time_slots) || !Array.isArray(event.attendees)) {
                    throw "Not given valid arrays!";
                }               
                success(event);
            } catch(e) {
                failure(e);
            }
        };

        // Write the the db on successful parse, write to console on failure
        parseEvent(req,
            // success
            function(event) {
                database.write_event(event);
                console.log(event);
            },

            // error
            function(error) {
                console.log(error);
            });

        res.end();
    });

    // API for getting the current list of events
    app.get('/api/events', function(req, res) {
        database.read_events(function(events) {
            res.send(JSON.stringify(events));
            console.log(JSON.stringify(events));
        });
    });

    // Start the server
    app.listen(8080);
*/
})(); // end of anononymous main