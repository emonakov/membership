var assert = require("assert");
var utility = require("../lib/utility");

function User (options) {
    assert.ok(options.email, "Email is required");
    this.email = options.email;
    this.createdAt = options.createdAt || new Date();
    this.status = options.status || "pending";
    this.signInCount = options.signInCount || 0;
    this.lastLogin = options.lastLogin || new Date();
    this.currentLoginAt = options.currentLoginAt || new Date();
    this.currentSessionToken = options.currentSessionToken || null;
    this.reminderSentAt = options.reminderSentAt || null;
    this.reminderToken = options.reminderToken || null;
    this.authenticationToken = options.authenticationToken || utility.randomString();
}

module.exports = User;