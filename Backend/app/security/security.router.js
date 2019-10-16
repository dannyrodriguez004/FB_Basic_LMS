const express = require('express');
const router = express.Router();

module.exports = (passport) => {
    router.get('/security/facebook',
        passport.authenticate('facebook'));

    router.get('/security/facebook/callback',
        passport.authenticate('facebook', {failureRedirect: '/login'}),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });
}
