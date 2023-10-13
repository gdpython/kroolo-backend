const dbConnection = require("./dbConnection")
const sequalize = require("../model/sequalize")
const YAML = require('yamljs');
const path = require('path');
const { CUURENT_API_VERSION } = require("../constants/appConstants") 
const { beautifyLog } = require("../helpers/function");
const listEndpoints = require('express-list-endpoints');
const routes = require(`../routes/${CUURENT_API_VERSION}`);
const seederSequalize = require('../seeders/mongoose');
const seederMongoose = require('../seeders/mongoose');
const postmanToOpenApi = require('postman-to-openapi');
const { DB_TYPE } = require("../constants/authConstant");
const swaggerUi = require('swagger-ui-express');

/**
 * Sets up the application after the database connection is established.
 *
 * @param {express.Application} app - The Express application.
 * @param {string} type - The type of database (SQL or NoSQL).
 */
const afterDB = (app,type) => {
  app.use(routes);
  app.use((req, res, next) => {
    console.log(`Hit route: ${req.method} ${req.path}`);
    let availableRoutes = getAllRoutes(app);
    availableRoutes = availableRoutes.map((route) => '/' + route.split(')')[1]);
    if (!availableRoutes.includes(req.path)) {
        console.log(`Route not found: ${req.path}`);
        const jsonResponse = {
            message: 'Route not found',
            error: `${req.path} not exist`,
        };
        return res.status(404).send(jsonResponse);
    }
    next();
});
  const allRegisterRoutes = listEndpoints(app);
  if(type===DB_TYPE.SQL){
    seederSequalize(allRegisterRoutes).then(() => { console.log('Seeding done.'); });
  }else if(type===DB_TYPE.NOSQL){
    seederMongoose(allRegisterRoutes).then(() => { console.log('Seeding done.'); });
  }
  postmanToOpenApi(`postman/${CUURENT_API_VERSION}/postman-collection.json`, path.join(`postman/${CUURENT_API_VERSION}/swagger.yml`), { defaultTag: 'General' }).then(data => {
    let result = YAML.load(`postman/${CUURENT_API_VERSION}/swagger.yml`);
    result.servers[0].url = '/';
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(result));
  })
}
/**
 * Connects to the SQL database and sets up the application.
 *
 * @param {express.Application} app - The Express application.
 */
const connectSQL = async (app) => {
  // dbConnection.sequelize
  sequalize.sequelize.sync({ alter: true }).then(() => {
    beautifyLog("SEQUALIZE CONNECTED")
    afterDB(app,DB_TYPE.SQL)
    console.log('Seeding done.');
  }).catch(({ message, name }) => {
    beautifyLog(`ERROR(${name}): ${message}`)
  })
}

/**
 * Connects to the MongoDB database and sets up the application.
 *
 * @param {express.Application} app - The Express application.
 */
const connectMongoDB = async (app) => {
  dbConnection.mongoose().then((res, error) => {
    if (res) {
      afterDB(app,DB_TYPE.NOSQL)
      return beautifyLog(`MONGODB CONNECTED`)
    }
    return beautifyLog(`ERROR(${error.name}): ${error.message}`)
  })
}
module.exports = {
  connectSQL,
  connectMongoDB
}