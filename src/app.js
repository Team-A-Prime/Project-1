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
    let database = new Database('./storage/events.db', function() {
        database.db.parallelize();
    });
    database.db.serialize();

    // Set up body-parser in the Express app
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Set up routing
    app.use(express.static('./public'))

    // API for getting the current list of events
    app.get('/api/events', function(req, res) {
        if(req.query.uid != undefined) {
            database.read_event(req.query.uid, function(event) {
                res.send(JSON.stringify(event));
            });
        } else {
            database.read_events(function(events) {
                res.send(JSON.stringify(events));
            });
        }
    });

    // API for creating a new event
    app.post('/api/events/new', function(req, res) {        
        let event         = new Event();
        event.name        = req.body.name;
        event.description = req.body.description;
        event.date        = req.body.date;
        event.owner       = req.body.owner;
        event.times       = req.body.times;
        event.uid         = event.hash().substr(0, 11);

        database.write_event(event);

        res.status(200).json({status: "ok"});
    });

    // API for adding a person to an event
    app.post('/api/events/register', function(req, res) {
        let parseRegister = (success, failure) => {
            let attendee   = {};
            attendee.event = req.body.event_uid;
            attendee.name  = req.body.name;
            try {
                attendee.times = JSON.parse(req.body.times);
                if(!Array.isArray(attendee.times)) {
                    throw "Not given valid arrays!";
                }               
                success(attendee);
            } catch(e) {
                failure(e);
            }
        };

        parseRegister(
            // success
            function(attendee) {
                database.register(attendee);
                res.status(200);
            },

            // failure
            function(err) {
                res.status(500).json({error: err});
            });
    });

    // Start the server
    app.listen(8080);
})(); // end of anononymous main