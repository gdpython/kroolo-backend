const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { country, roles} = require('../../data/index');
const { replaceAll } = require('../../utils/common');
async function countrySeed() {
    try {
        let countryToBeInserted = {};
        countryToBeInserted = await mongooseService.findOne(model.Country);
        if (!countryToBeInserted) {
            const result = await mongooseService.createMany(model.Country, country);
            if (result) console.info('Country model seeded 🍺');
        }
    } catch ({message}) {
        console.log('Country seeder failed due to ', message);
    }
}
async function routeSeed(routes) {
    try {
        if (routes) {
            let routeName = '';
            const dbRoutes = await mongooseService.findAll(model.Route, {});
            let routeArray = [];
            let routeObj = {};
            routes.forEach(route => {
                routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
                route.methods.forEach(method => {
                    routeObj = dbRoutes.find(dbRoute => dbRoute.routeName === routeName && dbRoute.method === method);
                    if (!routeObj) {
                        routeArray.push({
                            'routeURI': route.path.toLowerCase(),
                            'method': method,
                            'routeName': routeName,
                        });
                    }
                });
            });
            if (routeArray.length) {
                const result = await mongooseService.createMany(model.Route, routeArray);
                if (result) console.info('Route model seeded 🍺');
                else console.info('Route seeder failed.');
            } else {
                console.info('Route is upto date 🍺');
            }
        }
    } catch (error) {
        console.log('Route seeder failed due to ', error.message);
    }
}
async function roleSeed() {
    try {
        let roleBeInserted = {};
        roleBeInserted = await mongooseService.findOne(model.Role);
        if (!roleBeInserted) {
            const result = await mongooseService.createMany(model.Role, roles);
            if (result) console.info('Role model seeded 🍺');

        }
    } catch ({message}) {
        console.log('Roles seeder failed due to ', message);
    }
}
async function seedData(allRegisterRoutes) {
    await countrySeed();
    await routeSeed(allRegisterRoutes);
    await roleSeed();
};
module.exports = seedData;