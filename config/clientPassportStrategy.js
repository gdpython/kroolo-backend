/**
 * Exports an authentication strategy for the client using passport.js.
 *
 * @param {passport} passport - The passport object for authentication.
 * @returns {callback} Returns a callback to be used in middleware.
 */
const {
  Strategy, ExtractJwt
} = require('passport-jwt');
const { JWT } = require('../constants/authConstant');
const model = require('../model/sequalize');
const sqlService = require('../utils/sqlService');

/**
 * Client passport strategy function.
 *
 * @param {passport} passport - The passport object for authentication.
 */
const clientPassportStrategy = async (passport) => {
  const options = {};
  options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  options.secretOrKey = JWT.WEB_SECRET;
  passport.use('client-rule',
    new Strategy(options, async (payload, done) => {
      try {
        const user = await sqlService.findOne(model.staffManagement, { id: payload.id });
        if (user) {
          return done(null, { ...user.toJSON() });
        }
        return done('No User Found', {});
      } catch (error) {
        return done(error, {});
      }
    })
  );
};
module.exports = { clientPassportStrategy };