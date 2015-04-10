var assert = require("assert");
var Log = function (options) {
    assert.ok(options.subject && options.entry && options.userId, "Need subject, user_id and entry");
    var log = {};
    log.subject = options.subject;
    log.entry = options.entry;
    log.createdAt = new Date();
    log.userId = options.userId;
    return log;
};

module.exports = Log;