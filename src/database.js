/**
 * @file: database.js
 * @date: September 2017
 * @brief: Database object description
 */

var sqlite3 = require('sqlite3').verbose();

var crypto = require('crypto');

/**
 * Database(path)
 * @pre: nothing
 * @post: a database is created on disk at path
 * @return: a Database object
 * @param: 'path', the path for the database
 */
function Database(path) {
    this.path = path;
    this.db   = new sqlite3.Database(path);

    this.db.run("CREATE TABLE IF NOT EXISTS tb_events"
              + "("
              + "_id INTEGER PRIMARY KEY, "
              + "hash TEXT NOT NULL, "
              + "name TEXT NOT NULL, "
              + "description TEXT, "
              + "time_slots TEXT, "
              + "attendees TEXT"
              + ");");
} // end of function Database

/**
 * verify_event(event)
 * @pre: nothing
 * @post: nothing
 * @return: true if the 'event' param meets the requirements for an event object
 * @param: 'event', the object to be checked for validity
 */
Database.prototype.verify_event = function(event) {
    /* The structure event needs is:
     * name: string
     * description: string
     * time_slots: array
     * attendees: array
     * Note: We can't verify the types of these fields, just their existence
     */

     // taken from https://stackoverflow.com/questions/135448/how-do-i-check-if-an-object-has-a-property-in-javascript
     let has = function(obj, key) {
        return obj ? hasOwnProperty.call(obj, key) : false;
     };

     return (  has(event, 'name')
            && has(event, 'description')
            && has(event, 'time_slots')
            && has(event, 'attendees')
            );
} // end of function verify_event

Database.prototype.hash_event = function(event) {
    if(!this.verify_event(event)) {
        return false;
    }

    let sha256 = crypto.createHash('sha256');
    sha256.update(event.name);
    event.time_slots.forEach(function(ele, idx) {
        sha256.update("" + ele);
    });

    return sha256.digest('hex');
}

/**
 * write_event(event)
 * @pre: the db is initialized properly
 * @post: event is written to the db
 * @return: nothing
 * @param: 'event', the object to be written to the db
 */
Database.prototype.write_event = function(event) {
    if(!this.verify_event(event)) {
        return;
    }

    this.db.run("INSERT INTO tb_events (hash, name, description, time_slots, attendees) VALUES"
              + "("
              + '\'' + this.hash_event(event).substring(0, 8) + '\', '
              + '\'' + event.name + '\', '
              + '\'' + event.description + '\', '
              + '\'' + event.time_slots + '\', '
              + '\'' + event.attendees + '\''
              + ");");
} // end of function write_event

module.exports = Database;