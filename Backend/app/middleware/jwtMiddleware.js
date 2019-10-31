// const jwt = require("jsonwebtoken");
//
//
//
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
// module.exports = jwtMiddleware()
