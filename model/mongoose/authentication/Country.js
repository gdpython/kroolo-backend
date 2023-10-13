/**
 * @file Mongoose model for Country.
 * @module model/mongoose/authentication/Country
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for a Country document in MongoDB.
 *
 * @typedef {object} Country
 * @property {string} countryName - The name of the country.
 * @property {number} displayOrder - The display order for the country.
 * @property {string} flagIcon - The flag icon for the country.
 * @property {string} countryCode - The country code.
 * @property {string} currencyCode - The currency code.
 * @property {string} currencySymbol - The currency symbol.
 * @property {number} maxMobileLength - The maximum mobile number length.
 * @property {ObjectId} createdBy - The user who created the country (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the country (references the 'User' model).
 * @property {boolean} isActive - Indicates if the country is active.
 * @property {boolean} isDeleted - Indicates if the country is deleted.
 * @property {Date} createdAt - The timestamp when the country was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the country was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Country model.
 *
 * @type {mongoose.Schema}
 */
var CountrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        trim: true,
        default: ''
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    flagIcon: {
        type: String,
        default: ''
    },
    countryCode: {
        type: String,
        default: "1"
    },
    currencyCode: {
        type: String,
        default: ""
    },
    currencySymbol: {
        type: String,
        default: ""
    },
    maxMobileLength: {
        type: Number,
        default: 10
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
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'Country' collection.
 *
 * @type {mongoose.Model<Country>}
 */
module.exports = mongoose.model("Country", CountrySchema);
