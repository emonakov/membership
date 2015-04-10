var User = require("../../models/user");
var Application = require("../../models/application");
var Log = require("../../models/log");
var assert = require("assert");
var bc = require('bcrypt-nodejs');
var Emitter = require('events').EventEmitter;
var util = require('util');

function RegResult () {
    return result = {
        success: false,
        message: null,
        user: null
    };
}


var Registration = function (db) {
    Emitter.call(this);
    var self = this;
    var continueWith = null;

    var validateInputs = function (app) {
        if (!app.email && !app.password) {
            app.setInvalid("Email and password required");
            self.emit('invalid', app);
        } else if (app.password !== app.confirm) {
            app.setInvalid("Password mismatches");
            self.emit('invalid', app);
        } else {
            app.validate();
            self.emit('validated', app);
        }
    };

    var checkIfUserExists = function (app) {
        db.users.exists({email: app.email}, function (err, exists) {
            assert.ok(err === null);
            if(exists) {
                app.invalidate("email already exists");
                self.emit('invalid', app);
            } else {
                self.emit('user-doesnt-exist', app);
            }
        });
    };

    var addLogEntry = function (app) {
        var log = new Log({
            subject: "Registration",
            entry: "Registered successfully",
            userId: app.user.id
        });
        db.logs.save(log, function (err, newLog) {
            assert.ok(err === null, err);
            app.log = newLog;
            self.emit('log-created', app);
        });
    };

    var createUser = function (app) {
        var user = new User(app);
        user.status = "approved";
        user.signInCount++;
        db.users.save(user, function (err, newUser) {
            assert.ok(err === null, err);
            app.user = newUser;
            self.emit('user-created', app);
        });
    };

    self.applyForMembership = function (options, next) {
        continueWith = next;
        var app = new Application(options);
        self.emit('application-received', app);
    };

    var registrationOk = function (app) {
        var regResult = new RegResult();
        regResult.success = true;
        regResult.message = "Welcome!";
        regResult.user = app.user;
        regResult.log = app.log;
        if(continueWith) {
            continueWith(null, regResult);
        }
    };

    var registrationNotOk = function (app) {
        var regResult = new RegResult();
        regResult.success = false;
        regResult.message = app.message;
        if(continueWith) {
            continueWith(null, regResult);
        }
    };

    self.on('application-received', validateInputs);
    self.on('validated', checkIfUserExists);
    self.on('user-doesnt-exist', createUser);
    self.on('user-created', addLogEntry);
    self.on('log-created', registrationOk);
    self.on('invalid', registrationNotOk);

    return self;
};

util.inherits(Registration, Emitter);
module.exports = Registration;