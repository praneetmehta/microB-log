var express = require('express');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var user = require('../models/signup');
var info = require('../models/userinfo');
var router = express.Router();


mongoose.connect('mongodb://localhost/passport');

/* GET users listing. */
router.get('/home', function(req, res, next) {
    if (req.session.user) {
        info.findOne({ username: req.session.user }, function(err, user) {
            if (err) {
                console.log(err);
                res.redirect('');
            } else if (!user) {
                var blankobj = {};
                res.render('home', {
                    username: req.session.user,
                    user: blankobj
                });
            } else {
                return res.render('home', {
                    username: req.session.user,
                    user: user
                });
            }

        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end([
            '<p>You are not authorized</p>',
            '<p>Either <a href="/users/login">Log in</a> or <a href="/users/signup">SignUp</a></p>'
        ].join(''))
    }
});

router.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/users/login')
    } else {
        res.redirect('/users/login');
    }
})

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/chat', function(req, res) {
    res.render('chat', { username: req.session.user });
});

router.post('/signup', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var pwd = req.body.pwd;

    var newUser = new user();
    newUser.username = name;
    newUser.email = email;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pwd, salt);
    newUser.password = hash;
    newUser.save(function(err, savedObj) {
        if (err) {
            console.log(err);
        } else {

            return res.redirect('/users/login');

        }
    });

});

router.post('/login', function(req, res) {
    var name = req.body.name;
    var pwd = req.body.pwd;

    user.findOne({ username: name }, function(err, newUser) {
        if (err) {
            console.log(err);
            return res.redirect('/users/login');
        } else if (!newUser) {
            console.log('No such user');
            req.session.destroy();
            return res.redirect('/users/login');
        } else if (newUser) {
            if (bcrypt.compareSync(pwd, newUser.password)) {
                req.session.user = name;
                return res.redirect('/users/home');
            } else {
                console.log('incorrect pwd');
                req.session.destroy();
                return res.redirect('/users/login');
            }
        }
    });
});

router.post('/update', function(req, res) {
    var username = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var hostel = req.body.hostel;
    var room = req.body.room;
    var contact = req.body.contact;

    info.findOne({ username: username }, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/users/home');
        } else if (!user) {
            var newInfo = new info();
            newInfo.username = username;
            newInfo.firstname = firstname;
            newInfo.lastname = lastname;
            newInfo.email = email;
            newInfo.hostel = hostel;
            newInfo.room = room;
            newInfo.contact = contact;

            newInfo.save(function(err, info) {
                if (err) {
                    console.log(err);
                    res.redirect('/users/home');
                } else {
                    console.log('user info added for ' + username);

                    res.redirect('/users/home');
                }
            })
        } else if (user) {
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.hostel = hostel;
            user.room = room;
            user.contact = contact;
            user.save();


            res.redirect('/users/home');
        }
    })
})

module.exports = router;
