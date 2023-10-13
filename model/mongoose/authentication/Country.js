var mongoose = require('mongoose');
/**
 * Country Schema
 */
var CountrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        trim: true,
        required: true,
        default: ''
    },
    displayOrder:{
        type:Number,
        default:0
    },
    flagIcon: {
        type: String,
        required: true,
        default: ''
    },
    countryCode: {
        type: String,
        required: true,
        default: "1"
    },
    currencyCode: {
        type: String,
        required: true,
        default: ""
    },
    currencySymbol: {
        type: String,
        required: true,
        default: ""
    },
    maxMobileLength: {
        type: Number,
        required: true,
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