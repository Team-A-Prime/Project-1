/**
 * @file: event.js
 * @date: September 2017
 * @brief: Event object description
 */

var crypto = require('crypto');

/* The fields Event has:
 * name: string
 * description: string
 * time_slots: array
 * attendees: array
 * Note: We can't verify the types of these fields, just their existence
 */

/**
 * Event()
 * @pre: nothing
 * @post: the fields are set to their defaults
 * @return: an Event object
 */
function Event() {
    this.name        = "";
    this.description = "";
    this.time_slots  = [];
    this.attendees   = [];
} // end of function Event

/**
 * Event#hash()
 * @pre: nothing
 * @post: nothing
 * @return: a sha256 hash unique to the event name and time
 */
Event.prototype.hash = function() {
    let sha256 = crypto.createHash('sha256');
    sha256.update(this.name);
    this.time_slots.forEach(function(ele, idx) {
        sha256.update("" + ele);
    });

    return sha256.digest('hex');
} // end of function Event#hash


module.exports = Event;