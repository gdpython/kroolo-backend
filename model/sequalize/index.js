/**
 * index.js
 * @description :: exports all the models and its relationships among other models
 */

const { sequelize: dbConnection } = require('../../config/dbConnection');
const db = {};
db.sequelize = dbConnection;

db.user = require('./authentication/User');


//demo relations btw two schemas
/* db.menu.belongsTo(db.adminUserRoles, {
    foreignKey: 'roleId',
    as: 'roleData',
    sourceKey: 'id'
});
db.subscriptionPlan.hasOne(db.purchasePlan, {
    foreignKey: 'planId',
    as: 'purchasePlanData',
    sourceKey: 'id'
});
db.staffManagement.hasMany(db.assignSubject, {
    foreignKey: 'teacherId',
    as: 'assignSubjectData',
    sourceKey: 'id'
});
 */

module.exports = db;