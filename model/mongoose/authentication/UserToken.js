var mongoose = require('mongoose');
/**
 * UserToken Schema
 */
const date = new Date()
var UserTokenSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        require:true,
        default:''
    },
    tokeExpiredTime: {
        type: Date,
        default: date
    },
    isTokenExpired: {
        type: Boolean,
        default:false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("UserToken", UserTokenSchema);