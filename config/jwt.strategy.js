const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const secretAccessKey = process.env.JWT_SECRET;

const options = {
    secretOrKey: secretAccessKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

//Passport Strategy for authentication using jwt
const JWTStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload);
});

passport.use('jwt', JWTStrategy);

module.exports = {passport, jwtMiddleware: passport.authenticate('jwt', {session: false})};