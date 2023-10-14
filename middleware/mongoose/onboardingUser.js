const decodeJWT = require('jwt-decode');
const User = require('../../model/mongoose/authentication/User');
const CognitoExpress = require('cognito-express');
const { OAuth2Client } = require('google-auth-library');
const { findOne } = require('../../utils/mongooseService');
const { PLATFORM } = require('../../constants/authConstant');

/**
 * verify cognito token.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {promise} either token is valid in cognito identity pool.
 */
async function verify(token) {
    client = new OAuth2Client(process.env.CLIENT_ID);
    return new Promise((resolve, reject) => {
        client
            .verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID,
            })
            .then((ticket) => {
                const payload = ticket.getPayload();
                resolve(payload);
            })
            .catch((e) => {
                console.log('verifyIdToken', e);
                reject(e);
            });
    });
}

/**
 * Decode a JWT token.
 *
 * @param {string} token - The JWT token to decode.
 * @returns {Object|null} The decoded payload of the JWT token or null if decoding fails.
 */
const decodeToken = (token) => {
    try {
        return decodeJWT(token);
    } catch (e) {
        return null;
    }
};

/**
 * Handle Google Sign-In authentication.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @param {Object} decoded - The decoded JWT token payload.
 */
const handleGoogleSignIn = async (req, res, next, decoded) => {
    verify(token)
        .then(async (resp) => {
            const userExist = await findOne(User, { email: decoded.email });
            let user = null;
            if (!userExist) {
                const userObj = {
                    name: decoded.name,
                    email: decoded.email,
                };
                user = await new User(userObj).save();
            } else {
                user = userExist;
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            return res.unAuthorized({ message: err.message });
        });
};

/**
 * Handle Cognito authentication.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @param {Object} decoded - The decoded JWT token payload.
 */
const handleCognitoAuthentication = async (req, res, next, decoded) => {
    const cognitoExpress = new CognitoExpress({
        region: process.env.DEFAULT_AWS_REGION,
        cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        tokenExpiration: process.env.TOKEN_EXPIRE_TIME,
    });
    const token = (req.headers.authorization).replace('Bearer ', '')
    cognitoExpress.validate(token, async (err, response) => {
        if (err) {
            return res.unAuthorized({ message: err.message });
        } else {
            const user = await User.findOne({ email: decoded.username });
            req.user = user;
            next();
        }
    });
};

/**
 * Validate onboarding user based on JWT token.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
const validateOnboardingUser = (platform) => async (req, res, next) => {
    if (platform === PLATFORM.WEB) {
        const authorizationHeader = req.headers.authorization;

        if (authorizationHeader && authorizationHeader.split(' ')[0] === 'Bearer') {
            const token = authorizationHeader.replace('Bearer ', '');
            const decoded = decodeToken(token);

            if (decoded && decoded.iss && decoded.iss === 'accounts.google.com') {
                handleGoogleSignIn(req, res, next, decoded);
            } else {
                handleCognitoAuthentication(req, res, next, decoded);
            }
        } else {
            return res.unAuthorized({ message: 'Authorization token required!' });
        }
    }
};
module.exports = validateOnboardingUser