var mongoose = require('mongoose');
/**
 * Role Schema
 */
var RoleSchema = new mongoose.Schema({
    moduleName: {
        type: String,
        trim: true,
        default:''
    },
    roleName: {
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

module.exports = mongoose.model("Role", RoleSchema);