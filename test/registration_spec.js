var assert = require("assert");
var should = require("should");
var Registration = require("../lib/registration");
var db = require('secondthought');

var regResult,
    options = {
        email: "test@example.com",
        password: "testpass",
        confirm: "testpass"
    };

describe('Registration', function () {
    var reg = {};
    before(function (done) {
        db.connect({db: "membership"}, function (err, db) {
            reg = new Registration(db);
            done();
        });
    });
    describe('a valid app', function () {
        before(function (done) {
            db.users.destroyAll(function (err, result) {
                reg.applyForMembership(options, function (err, result) {
                    regResult = result;
                    done();
                });
            });
        });
        it("is succesfull", function () {
            regResult.success.should.equal(true);
        });
        it("creates a user", function () {
            regResult.user.should.be.defined;
        });
        it("creates a log entry", function () {
            regResult.log.should.be.defined;
        });
        it("sets the user's status to approved", function () {
            regResult.user.status.should.equal("approved");
        });
        it("tells user welcome message", function () {
            regResult.message.should.equal("Welcome!");
        });
        it("increments user's signInCount", function () {
            regResult.user.signInCount.should.equal(1);
        });
    });
});