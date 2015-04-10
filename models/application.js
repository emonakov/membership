var Application = function (options) {
    var app = {};
    app.email = options.email;
    app.password = options.password;
    app.confirm = options.confirm;
    app.status = "pending";
    app.message = null;
    app.user = null;
    app.log = null;

    app.isValid = function () {
        return app.status === "valid";
    };

    app.isInvalid = function () {
        return !app.isValid();
    };

    app.setInvalid = function (message) {
        app.status = "invalid";
        app.message = message;
        return app;
    };

    app.validate = function (message) {
        app.status = "valid";
        app.message = message;
        return app;
    };

    app.invalidate = function (message) {
        app.setInvalid(message);
        return app;
    };

    return app;
};

module.exports = Application;