/**
 * @file Mongoose model for Route.
 * @module model/mongoose/Route
 */

var mongoose = require('mongoose');
const { ROUTE_METHOD } = require('../../../constants/schemaConstants');

/**
 * Represents the schema for a Route document in MongoDB.
 *
 * @typedef {object} Route
 * @property {string} routeName - The name of the route.
 * @property {string} method - The HTTP method associated with the route (e.g., GET, POST).
 * @property {string} routeURI - The URI pattern of the route.
 * @property {ObjectId} createdBy - The user who created the route (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the route (references the 'User' model).
 * @property {boolean} isActive - Indicates if the route is active.
 * @property {boolean} isDeleted - Indicates if the route is deleted.
 * @property {Date} createdAt - The timestamp when the route was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the route was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Route model.
 *
 * @type {mongoose.Schema}
 */
var RouteSchema = new mongoose.Schema({
    routeName: {
        type: String,
        trim: true,
        default: ''
    },
    method: {
        type: String,
        trim: true,
        enum: ROUTE_METHOD,
        default: ROUTE_METHOD[0]
    },
    routeURI: {
        type: String,
        trim: true,
        default: ''
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
    }
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'Route' collection.
 *
 * @type {mongoose.Model<Route>}
 */
module.exports = mongoose.model("Route", RouteSchema);
