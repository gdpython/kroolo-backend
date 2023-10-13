/**
 * @file This module exports JSON data for all current diretory files.
 */

/**
 * Country data containing information about different countries.
 *
 * @typedef {Object} CountryData
 * @property {string} countryName - The name of the country.
 * @property {number} displayOrder - The display order of the country.
 * @property {string} flagIcon - The flag icon for the country.
 * @property {string} countryCode - The country code.
 * @property {string} currencyCode - The currency code.
 * @property {string} currencySymbol - The currency symbol.
 * @property {number} maxMobileLength - The maximum mobile number length.
 * @property {number} isActive - Indicates if the country is active (1 for active, 0 for inactive).
 * @property {number} isDeleted - Indicates if the country is deleted (1 for deleted, 0 for not deleted).
 */

/**
 * Roles data containing information about user roles.
 *
 * @typedef {Object} RolesData
 * @property {string} roleName - The name of the role.
 * @property {string} description - A description of the role.
 */

/**
 * Exported country and roles data.
 *
 * @type {{country: CountryData[], roles: RolesData[]}}
 */
const data = {
    country: require('./country.json'),
    roles: require('./roles.json')
};

module.exports = data;
