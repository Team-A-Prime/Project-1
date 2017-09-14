/**
 * @file: database.js
 * @date: September 2017
 * @brief: Database object description
 */

var sqlite3 = require('sqlite3').verbose();

var Event   = require('./event.js');

/**
 * Database(path)
 * @pre: nothing
 * @post: a database is created on disk at path
 * @return: a Database object
 * @param: 'path', the path for the database
 */
function Database(path, callback) {
    this.path        = path;

    const create_table = "CREATE TABLE IF NOT EXISTS tb_events"
                       + "("
                       + "uid TEXT NOT NULL, "
                       + "key TEXT NOT NULL, "
                       + "value TEXT NOT NULL, "
                       + "payload TEXT "
                       + ");";

    let obj = this; // used to access 'this' in the following closure
    
    // create/init connection to db
    this.db = new sqlite3.Database(path, function() {

        // create primary table
        obj.db.run(create_table, function() {
            if(callback) callback();
        });
    });
} // end of function Database

/**
 * Database#read_events()
 * @pre: the db being initialized
 * @post: the db is read
 * @param: 'callback' is a function called when the read is complete
 * @return: an array of the event objects read. if the db wasn't initialized, an
 *          empty array is returned
 */
Database.prototype.read_events = function(callback) {
    let events = [];

    let event_parse = function(event, key, value, paylod) {
        if(key == "name") {
            event.name = value;
        }
        if(key == "description") {
            event.description = value;
        }
        if(key == "date") {
            event.date = value;
        }
        if(key == "times") {
            event.times = value;
        }
        if(key == "owner") {
            event.owner = value;
        }
        // todo: attendees
    };

    let obj = this;
    events = new Array();

    // Get all distinct event UIDs
    this.db.all("SELECT DISTINCT uid FROM tb_events", function(uid_err, uid_rows) {

        uid_rows.forEach(function(uid_row) {
            let event = new Event();
            event.uid = uid_row.uid;

            obj.db.each("SELECT * FROM tb_events WHERE uid = '" + event.uid + "';", function(evnt_err, evnt_row) {
                event_parse(event, evnt_row.key, evnt_row.value, evnt_row.paylod);
            }, function() {
                events.push(event);
                if(events.length == uid_rows.length) callback(events);
            });
        });
    });
} // end of Database#read_events

/**
 * Database#write_event(event)
 * @pre: the db is initialized properly
 * @post: event is written to the db
 * @return: nothing
 * @param: 'event', the object to be written to the db
 */
Database.prototype.write_event = function(event) {
    let obj = this;
    let write_keyval = function(key, val) {
        let query = "INSERT INTO tb_events (uid, key, value) VALUES "
                  + "("
                  + "'" + event.uid + "', "
                  + "'" + key + "', "
                  + "'" + val + "'"
                  + " );";
        obj.db.run(query);
    };

    [["name",        event.name],
     ["description", event.description],
     ["date",        event.date],
     ["times",       event.times],
     ["owner"],      event.owner]
     .forEach(function(keyval) {
        write_keyval(keyval[0], keyval[1]);
    });
} // end of function Database#write_event

module.exports = Database;