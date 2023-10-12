const model = require('../../model/sequalize');
const sqlService = require('../../utils/sqlService');
const { country} = require('../../data/index');
const { replaceAll } = require('../../utils/common');
async function countrySeed() {
    try {
        let countryToBeInserted = {};
        countryToBeInserted = await sqlService.findOne(model.country);
        if (!countryToBeInserted) {
            await sqlService.createMany(model.country, country);
        }
    } catch ({message}) {
        console.log('Country seeder failed due to ', message);
    }
}
async function routeSeed(routes) {
    try {
        if (routes) {
            let routeName = '';
            const dbRoutes = await sqlService.findAll(model.Route, {});
            let routeArr = [];
            let routeObj = {};
            routes.forEach(route => {
                routeName = `${replaceAll((route.path).toLowerCase(), '/', '_')}`;
                route.methods.forEach(method => {
                    routeObj = dbRoutes.find(dbRoute => dbRoute.route_name === routeName && dbRoute.method === method);
                    if (!routeObj) {
                        routeArr.push({
                            'routeURI': route.path.toLowerCase(),
                            'method': method,
                            'routeName': routeName,
                        });
                    }
                });
            });
            if (routeArr.length) {
                const result = await sqlService.createMany(model.Route, routeArr);
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
async function seedData(allRegisterRoutes) {
    await countrySeed();
    await routeSeed(allRegisterRoutes)
};
module.exports = seedData;