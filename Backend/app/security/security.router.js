const express = require('express');
const router = express.Router();
// const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
var passport = require('passport');
const d = require('./passport.strategy');
const database = require('firebase-admin').database();
// const jwtMiddleware = (req, res, next) => {
//     const authString = req.headers['authorization'];
//     if(typeof authString === 'string' && authString.indexOf(' ') > -1) {
//         const authArray = authString.split(' ');
//         const token = authArray[1];
//         jwt.verify(token, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx', (err, decoded) =>
//         {
//             if(err) {
//                 res.status(403).send({
//                     errorMessage: 'Permission denied'
//                 });
//             } else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         res.status(403).send({
//             errorMessage: 'Permission denied'
//         });
//
//     }
// };

module.exports = (passport) => {

    router.get('/foo', async (req, res, next) => {
        res.json('foo');
    })

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

    router.post('/auth/facebook', (req, res, next) => {
            console.log("HERE I AM AUTH FACEBOOK");
            var userID = req.body.params.updates[0].value;
            console.log(userID);
            const token = jwt.sign(userID, '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx');
            console.log('TOKEN = ' + token);
        if (!userID) {
                return res.send(401, 'UserModel Not Authenticated');
            }
            // prepare token for API
        res.status(200).send({
             user: userID,
            token: token
        });
    });

    router.get('/auth/me', passport.authenticate('jwt', {session:true}), async (req, res, next) => {
        console.log('IN AUTHME');
        console.log(req.user);
        var users = await database.ref('/users').orderByKey().equalTo(req.user).once('value');
        if(users) {
            res.json({
                userID: req.user,
                // user_info: users.child(req.user),
                first_name: users.child(req.user).first_name,
                last_name: users.child(req.user).last_name,
                email: users.child(req.user).email,
                phone: users.child(req.user).phone,
                country: users.child(req.user).country

            });
        } else {
            console.log('AUTH/ME CANNOT GET USERS');
            res.json({userID: req.user});
        }
    });
    return router;
}

