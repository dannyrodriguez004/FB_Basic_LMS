// import * as req from "firebase";
//
// const database = require('firebase-admin').database();
// // const userService = require('../users/users.service');
// const expressJwt = require('express-jwt');
// const crypto = require('bcrypt');
// const jwt = require('jsonwebtoken');
//
// class SecurityService {
//     constructor() {
//     }

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
    //
    // async createToken(auth) {
    //     return jwt.sign({
    //             id: auth.id
    //         }, '69945f3bf613bc74837419d8713eff9e',
    //         {
    //             expiresIn: 60 * 120
    //         });
    // }
    //
    // async generateToken() {
    //     req.token = createToken(req.auth);
    //     next();
    // }
    //
    // async sendToken() {
    //     res.setHeader('x-auth-token', req.token);
    //     res.status(200).send(req.auth);
    // }
    //
    // async getCurrentUser() {
    //
    //     User.findById(req.auth.id, function (err, user) {
    //         if (err) {
    //             next(err);
    //         } else {
    //             req.user = user;
    //             next();
    //         }
    //     });
    // }
    //
    // async authenticate() {
    //     expressJwt({
    //         secret: '69945f3bf613bc74837419d8713eff9e',
    //         requestProperty: 'auth',
    //         getToken: function (req) {
    //             if (req.headers['x-auth-token']) {
    //                 return req.headers['x-auth-token'];
    //             }
    //             return null;
    //         }
    //     });
    //
    //     async getOne()
    //     {
    //         var user = req.user.toObject();
    //         delete user['facebookProvider'];
    //         delete user['__v'];
    //         res.json(user);
    //     }
    // }
// }
// module.exports = new SecurityService();
