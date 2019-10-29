const express = require('express');
const router = express.Router();
// const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
var passport = require('passport');
const d = require('./passport.strategy');

const securityServices = require('./security.service');
const jwtMiddleware = (req, res, next) => {
    const authString = req.headers['authorization'];
    if(typeof authString === 'string' && authString.indexOf(' ') > -1) {
        const authArray = authString.split(' ');
        const token = authArray[1];
        jwt.verify(token, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx', (err, decoded) =>
        {
            if(err) {
                res.status(403).send({
                    errorMessage: 'Permission denied'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            errorMessage: 'Permission denied'
        });

    }
};
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
        console.log("AUTH : ");
        console.log(auth);
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
        console.log(JSON.stringify(req.body));
        console.log('TOKEN:' + req.token);
        res.status(200).send(req.auth);
        console.log('REQ.AUTH' + req.auth);
    };

    // passport.authenticate('facebook-token', {session: true})

    router.post('/auth/facebook', (req, res, next) => {
            console.log("HERE I AM AUTH FACEBOOK");
            // console.log(JSON.stringify(req.body.params.updates));  JSON.parse(JSON.stringify
            var userID = req.body.params.updates[0].value;
            console.log(userID);
            const token = jwt.sign(userID, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx');
            console.log('TOKEN = ' + token);
        if (!userID) {
                return res.send(401, 'User Not Authenticated');
            }
            // prepare token for API
        res.status(200).send({
            // user: userID,
            token: token
        });
    });

// token handling middleware
//     var authenticate = expressJwt({
//         secret: '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
//         requestProperty: 'auth',
//         getToken: function(req) {
//             if (req.headers['x-auth-token']) {
//                 console.log("REQHEADERS:");
//                 console.log(req.headers['x-auth-token']);
//                 return req.headers['x-auth-token'];
//             }else{
//             return null;
//             }
//         }
//     });


    // var getCurrentUser = function(req, res, next) {
    //     console.log('GETCURR USER');
    //     User.findById(req.auth.id, function(err, user) {
    //         if (err) {
    //             next(err);
    //         } else {
    //             req.user = user;
    //             next();
    //         }
    //     });
    // };
    //
    // var getOne = function (req, res) {
    //     var user = req.user.toObject();
    //
    //     delete user['facebookProvider'];
    //     delete user['__v'];
    //
    //     res.json(user);
    // };

    router.get('/auth/me', jwtMiddleware, function (req,res) {
        console.log('IN AUTHME');
        console.log(req.decoded);
        res.json({userID: req.decoded});

    });

    return router;
}

