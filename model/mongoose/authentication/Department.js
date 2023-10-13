/**
 * @file Mongoose model for Department.
 * @module model/mongoose/authentication/Department
 */

var mongoose = require('mongoose');

/**
 * Represents the schema for a Department document in MongoDB.
 *
 * @typedef {object} Department
 * @property {string} departmentName - The name of the department.
 * @property {ObjectId} organizationID - The ID of the organization to which the department belongs (references the 'Organization' model).
 * @property {ObjectId} createdBy - The user who created the department (references the 'User' model).
 * @property {ObjectId} updatedBy - The user who last updated the department (references the 'User' model).
 * @property {boolean} isActive - Indicates if the department is active.
 * @property {boolean} isDeleted - Indicates if the department is deleted.
 * @property {Date} createdAt - The timestamp when the department was created (auto-generated).
 * @property {Date} updatedAt - The timestamp when the department was last updated (auto-generated).
 */

/**
 * Mongoose schema for the Department model.
 *
 * @type {mongoose.Schema}
 */
var DepartmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        trim: true,
        required:true,
        default: ''
    },
    organizationID: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
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
}, {
    timestamps: true
});

/**
 * Mongoose model for the 'Department' collection.
 *
 * @type {mongoose.Model<Department>}
 */
module.exports = mongoose.model("Department", DepartmentSchema);
