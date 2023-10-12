var mongoose = require('mongoose');
/**
 * Department Schema
 */
var DepartmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        trim: true,
        require:true,
        default: ''
    },
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        require:true,
        ref: "Organization"
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

module.exports = mongoose.model("Department", DepartmentSchema);