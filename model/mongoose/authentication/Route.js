var mongoose = require('mongoose');
const { ROUTE_METHOD } = require('../../../constants/schemaConstants');
/**
 * Route Schema
 */
var RouteSchema = new mongoose.Schema({
    routeName: {
        type: String,
        trim: true,
        default:''
    },
    method: {
        type: String,
        trim: true,
        enum: ROUTE_METHOD,
        default:ROUTE_METHOD[0]
    },
    routeURI: {
        type: String,
        trim: true,
        default:''
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

module.exports = mongoose.model("Route", RouteSchema);