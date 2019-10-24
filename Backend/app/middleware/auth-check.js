const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret_this_should_be_longer");
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
};

//token handling middleware
//     var authenticate = expressJwt({
//         secret: 'my-secret',
//         requestProperty: 'auth',
//         getToken: function(req) {
//             if (req.headers['x-auth-token']) {
//                 return req.headers['x-auth-token'];
//             }
//             return null;
//         }
//     });
