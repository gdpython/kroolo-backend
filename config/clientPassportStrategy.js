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
const model = require('../model/mongoose');
const mongooseService = require('../utils/mongooseService');

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
      //here we will get organizationID and cognito token
      try {
        const organizationData = await mongooseService.findOne(model.OrganizationMember, { _id: payload.organizationID });
        if (organizationData) {
          return done(null, { ...organizationData.toJSON() });
        }
        return done('No organization Found', {});
      } catch (error) {
        return done(error, {});
      }
    })
  );
};
module.exports = { clientPassportStrategy };