/**
 * index.js
 * @description Seeder functions for MongoDB models.
 */

const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');
const { country, roles } = require('../../data/index');
const { replaceAll, catchAll } = require('../../utils/common');

/**
 * Seed the 'Country' model with data if it doesn't exist.
 * @function
 */
async function countrySeed() {
    try {
        let countryToBeInserted = {};
        countryToBeInserted = await mongooseService.findOne(model.Country);
        if (!countryToBeInserted) {
            const result = await mongooseService.createMany(model.Country, country);
            if (result) console.info('Country model seeded 🍺');
        } else {
            console.info('Country is up to date 🍺');
        }
    } catch ({ message }) {
        catchAll({ message: `Country seeder failed due to ${message}` });
    }
}

/**
 * Seed the 'Route' model with data if routes are provided.
 * @function
 * @param {Object[]} routes - An array of route objects.
 */
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
                console.info('Route is up to date 🍺');
            }
        }
    } catch ({ message }) {
        catchAll({ message: `Route seeder failed due to ${message}` });
    }
}

/**
 * Seed the 'Role' model with data if it doesn't exist.
 * @function
 */
async function roleSeed() {
    try {
        let roleBeInserted = {};
        roleBeInserted = await mongooseService.findOne(model.Role);
        if (!roleBeInserted) {
            const result = await mongooseService.createMany(model.Role, roles);
            if (result) console.info('Role model seeded 🍺');
        } else {
            console.info('Role is up to date 🍺');
        }
    } catch ({ message }) {
        catchAll({ message: `Roles seeder failed due to ${message}` });
    }
}

/**
 * Seed data for various models.
 * @function
 * @param {Object[]} allRegisterRoutes - An array of registered routes.
 */
async function seedData(allRegisterRoutes) {
    await countrySeed();
    await routeSeed(allRegisterRoutes);
    await roleSeed();
}

module.exports = seedData;
