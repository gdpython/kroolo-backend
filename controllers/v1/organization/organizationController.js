/**
 * Controller for organization methods related to all user types.
 * @module controllers/v1/channels/organizationController
 */

const formidable = require('formidable');
const model = require('../../../model/mongoose');
const { findOne, createOne, updateOne } = require('../../../utils/mongooseService');

/**
 * Handles the retrieval of organization data by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const getOrganization = async (req, res) => {
    try {
        /**
         * Retrieves organization data by its unique ID.
         *
         * @param {string} organizationID - The unique identifier of the organization.
         */
        const { organizationID } = req.params;

        /**
         * The retrieved organization data.
         * @typedef {Object} OrganizationData
         * @property {string} organizationName - The name of the organization.
         */

        /**
         * The organization data fetched successfully response.
         * @typedef {Object} SuccessResponse
         * @property {OrganizationData} data - The organization data.
         * @property {string} message - A success message.
         */

        const organizationData = await findOne(model.Organizations, { _id: organizationID }, { organizationName: true });
        if (!organizationData) {
            return res.failure({
                message: `Organization not found by id(${organizationID}).`
            });
        }

        return res.success({
            data: organizationData,
            message: 'Organization data fetched successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the creation of a new organization.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const createOrganization = async (req, res) => {
    try {
        /**
         * The name of the new organization to be created.
         *
         * @param {string} organizationName - The name of the organization.
         */
        const { organizationName } = req.body;

        /**
         * The organization data created successfully response.
         * @typedef {Object} SuccessResponse
         * @property {OrganizationData} data - The created organization data.
         * @property {string} message - A success message.
         */

        const organizationData = await createOne(model.Organizations, { organizationName });
        return res.success({
            data: organizationData,
            message: 'Organization created successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

/**
 * Handles the update of an organization's name by its ID.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
const updateOrganization = async (req, res) => {
    try {
        /**
         * The updated name of the organization.
         *
         * @param {string} organizationName - The updated name of the organization.
         */
        const { organizationName, organizationID } = req.body;

        /**
         * The organization data updated successfully response.
         * @typedef {Object} SuccessResponse
         * @property {OrganizationData} data - The updated organization data.
         * @property {string} message - A success message.
         */

        const organizationData = await updateOne(model.Organizations, { organizationName }, { organizationID });
        return res.success({
            data: organizationData,
            message: 'Organization updated successfully.'
        });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
};

module.exports = {
    getOrganization,
    createOrganization,
    updateOrganization
};
