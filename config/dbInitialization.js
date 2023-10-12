const dbConnection = require("./dbConnection")
const sequalize = require("../model/sequalize")
const YAML = require('yamljs');
const path = require('path');
const { beautifyLog } = require("../helpers/function");
const listEndpoints = require('express-list-endpoints');
const routes = require('../routes');
const seederSequalize = require('../seeders/mongoose');
const seederMongoose = require('../seeders/mongoose');
const postmanToOpenApi = require('postman-to-openapi');
const { DB_TYPE } = require("../constants/authConstant");

const afterDB = (app,type) => {
  app.use(routes);
  const allRegisterRoutes = listEndpoints(app);
  if(type===DB_TYPE.SQL){
    seederSequalize(allRegisterRoutes).then(() => { console.log('Seeding done.'); });
  }else if(type===DB_TYPE.NOSQL){
    seederMongoose(allRegisterRoutes).then(() => { console.log('Seeding done.'); });
  }
  // postmanToOpenApi(`postman/${process.env.CUURENT_API_VERSION}/postman-collection.json`, path.join('postman/swagger.yml'), { defaultTag: 'General' }).then(data => {
  //   let result = YAML.load('postman/swagger.yml');
  //   result.servers[0].url = '/';
  //   app.use('/swagger', swaggerUi.serve, swaggerUi.setup(result));
  // })
}
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