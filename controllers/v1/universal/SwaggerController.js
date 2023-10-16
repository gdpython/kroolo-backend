/**
 * Controller for Swagger UI methods.
 * @module controllers/v1/channels/swaggerController
 */

const postmanToOpenApi = require('postman-to-openapi');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const { CUURENT_API_VERSION } = require('../../../constants/appConstants');

/**
 * Serves the Swagger UI assets.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const serveSwaggerUI = async(req, res) => {
  console.log("Ddd");
  // postmanToOpenApi(`postman/${CUURENT_API_VERSION}/postman-collection.json`,
  //   path.join(`postman/${CUURENT_API_VERSION}/swagger.yml`), { defaultTag: 'General' }).then(data => {
      const result = YAML.load(`postman/${CUURENT_API_VERSION}/swagger.yml`);
      result.servers[0].url = '/';
      console.log("swaggerUi",swaggerUi.serve);
      swaggerUi.serve(req, res);
    // })
};

/**
 * Sets up the Swagger UI.
 *
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
const setupSwaggerUI = async (req, res) => {
  console.log("eee");
  postmanToOpenApi(`postman/${CUURENT_API_VERSION}/postman-collection.json`,
    path.join(`postman/${CUURENT_API_VERSION}/swagger.yml`), { defaultTag: 'General' }).then(data => {
      const result = YAML.load(`postman/${CUURENT_API_VERSION}/swagger.yml`);
      result.servers[0].url = '/';
      swaggerUi.setup(result)(req, res);
    })
};

module.exports = {
  serveSwaggerUI,
  setupSwaggerUI
};
