const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
var passport = require('passport');
const d = require('./passport.strategy');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({extended: false});

// const securityServices = require('./security.service');
module.exports = (passport) => {

    router.get('/foo', async (req, res, next) => {
        res.json('foo');
    })
    //
    // router.get('/security/facebook',
    //     passport.authenticate('facebook'));
    //
    // router.get('/security/facebook/callback',
    //     passport.authenticate('facebook', {failureRedirect: '/login'}),
    //     function (req, res) {
    //         // Successful authentication, redirect home.
    //         res.redirect('/');
    //     });

    var createToken = function(auth) {
        return jwt.sign({
                id: auth.id
            }, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
            {
                expiresIn: 60 * 120
            });
    };

    var generateToken = function (req, res, next) {
        req.token = createToken(req.auth);
        next();
    };

    var sendToken = function (req, res) {
        res.setHeader('x-auth-token', req.token);
        res.status(200).send(req.auth);
    };


    // passport.authenticate('facebook-token', {session: true})

    router.post('/auth/facebook', urlEncodedParser, (req, res, next) => {
            console.log("HERE I AM AUTH FACEBOOK");
            // console.log(JSON.stringify(req.body.params.updates));
            var accessToken = JSON.parse(JSON.stringify(req.body.params.updates));
            console.log(accessToken[0]);
        if (!accessToken[0].value) {
                return res.send(401, 'User Not Authenticated');
            }
            // prepare token for API
            req.auth = {
                id: accessToken[0].value
            };

            next();
        }, generateToken, sendToken);

// token handling middleware
    var authenticate = expressJwt({
        secret: '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
        requestProperty: 'auth',
        getToken: function(req) {
            if (req.headers['x-auth-token']) {
                return req.headers['x-auth-token'];
            }
            return null;
        }
    });

    var getCurrentUser = function(req, res, next) {
        User.findById(req.auth.id, function(err, user) {
            if (err) {
                next(err);
            } else {
                req.user = user;
                next();
            }
        });
    };

    var getOne = function (req, res) {
        var user = req.user.toObject();

        delete user['facebookProvider'];
        delete user['__v'];

        res.json(user);
    };

    router.get('/auth/me', authenticate, getCurrentUser, getOne);

    return router;
}

