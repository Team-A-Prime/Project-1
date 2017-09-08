/**
 * @file: database.js
 * @date: September 2017
 * @brief: Database object description
 */

var sqlite3 = require('sqlite3').verbose();

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
 * Database#write_event(event)
 * @pre: the db is initialized properly
 * @post: event is written to the db
 * @return: nothing
 * @param: 'event', the object to be written to the db
 */
Database.prototype.write_event = function(event) {
    this.db.run("INSERT INTO tb_events (hash, name, description, time_slots, attendees) VALUES"
              + "("
              + '\'' + event.hash().substring(0, 8) + '\', '
              + '\'' + event.name + '\', '
              + '\'' + event.description + '\', '
              + '\'' + event.time_slots + '\', '
              + '\'' + event.attendees + '\''
              + ");");
} // end of function Database#write_event

module.exports = Database;