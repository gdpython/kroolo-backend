var mongoose = require('mongoose');
/**
 * Country Schema
 */
var CountrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        trim: true,
        default: ''
    },
    displayOrder:{
        type:Number,
        default:0
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
},
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Country", CountrySchema);