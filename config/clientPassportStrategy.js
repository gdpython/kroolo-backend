/**
 * @description : exports authentication strategy for client using passport.js
 * @params {obj} passport : passport object for authentication
 * @return {callback} : returns callback to be used in middleware
 */

const {
    Strategy, ExtractJwt
  } = require('passport-jwt');
  const { JWT } = require('../constants/authConstant');
  const model = require('../model/sequalize');
  const sqlService = require('../utils/sqlService');
  
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