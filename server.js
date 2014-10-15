var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    type: Boolean

});

userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var UserDb = mongoose.model('User', userSchema);

mongoose.connect('mongodb://localhost/myapp');

app.post('/api/signup', function(req, res, next) {

    var type = 0;

    var user = new UserDb({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: type
    });
    user.save(function(err) {
        if (err) return next(err);
        res.send(200);
    });
});
app.post('/api/user/remove', function(req, res, next) {

    var id = req.body.id;
    UserDb.findByIdAndRemove(id, function (err, doc) {
        res.send(doc);
    });
});
app.post('/api/user/edit', function(req, res, next) {

    var user = new UserDb({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        type: req.body.type
    });
    user.update( req.body.id ,function(err) {
        if (err) return next(err);
        res.send(200);
    });
});
app.post('/api/user/get', function(req, res, next) {

    var id = req.body.id;
    UserDb.findById(id, function (err, doc) {
        res.send(doc);
    });
});

app.get('/api/logout', function(req, res, next) {
    req.logout();
    res.send(200);
});

app.get('/api/users', function(req, res, next) {
    var query = UserDb.find();
    query.exec(function(err, users) {
        if (err) return next(err);
        res.send(users);
    });
});

app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserDb.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ loginField: 'username' }, function(username, password, done) {

    UserDb.findOne({ username: username }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false);
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (isMatch) return done(null, user);
            return done(null, false);
        });
    });
}));


app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.cookie('user', JSON.stringify(req.user));
    res.send(req.user);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.send(401);
}

app.use(function(req, res, next) {
    if (req.user) {
        res.cookie('user', JSON.stringify(req.user));
    }
    next();
});