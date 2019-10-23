var LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const JwtExtract = require('passport-jwt').ExtractJwt;
const firebaseDB = require('firebase-admin').database();
const crypto = require('bcrypt');
const FacebookTokenStrategy = require('passport-facebook-token');

var passport = require('passport');

module.exports = (passport) => {

    passport.serializeUser( (user, callback) => {
        callback(null, user);
    });

    passport.deserializeUser( (user, callback) => {
        callback(null, user);
    });


    passport.use(new FacebookTokenStrategy({
            clientID: '398974807682335',
            clientSecret: '69945f3bf613bc74837419d8713eff9e',
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
        // User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
            //     return done(err, user);
            // });
        }));
    //
    // passport.use(new FacebookStrategy({
    //         clientID: '398974807682335',
    //         clientSecret: '69945f3bf613bc74837419d8713eff9e',
    //         callbackURL: "https://locallhost:3001/security/facebook/auth"
    //     },
    //     function(accessToken, refreshToken, profile, cb) {
    //         User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //             return cb(err, user);
    //         });
    //     }
    // ));

    passport.use( new LocalStrategy(
        async function(username, password, callback) {
            if(!username) {
                return callback(null, false);
            }
            if(!password) {
                return callback(null, false);
            }

            var users = await firebaseDB.ref('/instructors')
                .orderByChild('email')
                .equalTo(username)
                .once('value');
            
            if(users.numChildren() != 1) {
                return callback(null, false);
            } else {
                users.forEach( (record) => {
                    const user = JSON.parse(JSON.stringify(record));
                    user.key = record.key;
                    crypto.compare(password, user.password, (err, same) => {
                        if(same) {
                            return callback(null, user);
                        } else {
                            return callback(null, false);
                        }
                    })
                });
            }
        }
    ));

    // passport.use(new FacebookStrategy({
    //         clientID: '398974807682335',
    //         clientSecret: '69945f3bf613bc74837419d8713eff9e',
    //         callbackURL: "https://locallhost:3001/security/facebook/auth"
    //     },
    //     function(accessToken, refreshToken, profile, cb) {
    //         User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    //             return cb(err, user);
    //         });
    //     }
    // ));
    passport.use(new JwtStrategy({
        jwtFromRequest: JwtExtract.fromAuthHeaderAsBearerToken(),
        secretOrKey: '85tHm4SdMr7QmT2Xsi20Kcx3XUI3OGYf8siO5JMiThZICLMCtge01L3zDG0qBXx',
    },
        function (jwtPayload, callback) {
            return callback(null, jwtPayload);
        }));
}
