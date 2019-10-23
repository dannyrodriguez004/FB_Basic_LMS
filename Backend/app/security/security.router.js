const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
var passport = require('passport');

module.exports = (passport) => {

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
            }, 'my-secret',
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
    // passport.authenticate('facebook-token', {session: false})
    router.post('/auth/facebook', function(req, res, next) {
            console.log("HERE I AM AUTH FACEBOOK");
            if (!req.user) {
                return res.send(401, 'User Not Authenticated');
            }

            // prepare token for API
            req.auth = {
                id: req.user.id
            };

            next();
        }, generateToken, sendToken);

//token handling middleware
    var authenticate = expressJwt({
        secret: 'my-secret',
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
    //
    router.get('/auth/me', authenticate, getCurrentUser, getOne);

    // app.use('/security', router);
    return router;
}

