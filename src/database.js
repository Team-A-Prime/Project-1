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
    this.path = path;

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
}; // end of function Database

/**
 * Database#keyval_parse()
 * @pre: nothing
 * @post: the event parameter is modified
 * @param: 'event' is the event to modify, 'key' and 'value' are the given keyval pair, 'payload' is an optional payload
 * @return: nothing
 */
Database.prototype.keyval_parse = function(event, key, value, paylod) {
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
}; // end of function Database#keyval_parse

/**
 * Database#read_event()
 * @pre: the db being initialized
 * @post: the db is read
 * @param: 'uid' is the event uid to get, callback' is a function called when the read is complete
 * @return: nothing
 */
Database.prototype.read_event = function(uid, callback) {
    let event = new Event();
    let obj   = this;
    this.db.each("SELECT * FROM tb_events WHERE uid = " + uid + ";", function(err, row) {
        event.uid = uid;
        obj.keyval_parse(event, row.key, row.value, row.paylod);
    }, function(err, rows) {
        if(rows != undefined && rows != 0) {
            callback(event);
        } else {
            callback(null);
        }
    });
}; // end of Database#read_event

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

    let obj = this;
    events = new Array();

    // Get all distinct event UIDs
    this.db.all("SELECT DISTINCT uid FROM tb_events", function(uid_err, uid_rows) {

        // Iterate through each UID
        uid_rows.forEach(function(uid_row) {

            // Get the event object with this UID from the db
            obj.read_event(uid_row.uid, function(event) {
                events.push(event);
                if(events.length == uid_rows.length) {
                    callback(events);
                }
            });
        });
    });
}; // end of Database#read_events

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
}; // end of function Database#write_event

module.exports = Database;