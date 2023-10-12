var mongoose = require('mongoose');
/**
 * RouteRole Schema
 */
var RouteRoleSchema = new mongoose.Schema({
    routeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Route'
    },
    roleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Role'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

module.exports = mongoose.model("RouteRole", RouteRoleSchema);