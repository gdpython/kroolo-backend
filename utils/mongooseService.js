const models = require('../model/mongoose');

// create one record
const createOne = async (model, data) => {
  try {
    const result = await model.create(data);
    return result;
  } catch (error) {
    // Handle errors here
    console.error(error);
    throw error;
  }
};

// create multiple records
const createMany = async (model, data) => {
  try {
    const result = await model.insertMany(data);
    return result;
  } catch (error) {
    // Handle errors here
    console.error(error);
    throw error;
  }
};

// update record(s) when query matches
const update = async (model, query, data) => {
  query = queryBuilderParser(query);
  const result = await model.updateMany(query, data);
  return result;
};

// delete record(s) when query matches
const destroy = async (model, query) => {
  query = queryBuilderParser(query);
  const result = await model.deleteMany(query);
  return result;
};

// find single record
const findOne = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  return model.findOne(query, options);
};

// find multiple records with pagination
const paginate = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  if (options && options.select && options.select.length) {
    options.select = options.select.join(' ');
  }
  if (options && options.sort) {
    options.sort = sortParser(options.sort);
  }
  if (options && options.populate && options.populate.length) {
    options.populate = options.populate.map((pop) => ({
      path: pop,
      model: models[pop],
    }));
  }
  const result = await model.find(query)
    .select(options.select)
    .sort(options.sort)
    .populate(options.populate)
    .skip((options.page - 1) * options.paginate)
    .limit(options.paginate);
  const totalCount = await model.countDocuments(query);
  const data = {
    data: result,
    paginator: {
      itemCount: totalCount,
      perPage: options.paginate || 25,
      pageCount: Math.ceil(totalCount / options.paginate),
      currentPage: options.page || 1,
    },
  };
  return data;
};

// find multiple records without pagination
const findAll = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  if (options && options.select && options.select.length) {
    options.select = options.select.join(' ');
  }
  if (options && options.sort) {
    options.sort = sortParser(options.sort);
  }
  if (options && options.populate && options.populate.length) {
    options.populate = options.populate.map((pop) => ({
      path: pop,
      model: models[pop],
    }));
  }
  const result = await model.find(query)
    .select(options.select)
    .sort(options.sort)
    .populate(options.populate);
  return result;
};

// count records for specified query
const count = async (model, query) => {
  query = queryBuilderParser(query);
  return model.countDocuments(query);
};

// upsert record
const upsert = async (model, data) => {
  const result = await model.updateOne(data, { upsert: true });
  return result;
};

// update one record
const updateOne = async (model, query, data) => {
  const result = await model.updateOne(query, data);
  return result;
};

// find single selected record
const findOneSelected = async (model, query, selectOptions) => {
  query = queryBuilderParser(query);
  return model.findOne(query).select(selectOptions);
};
// Your queryBuilderParser function
const queryBuilderParser = (data) => {
  const mongooseQuery = {};

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object') {
        // Recursively handle nested conditions
        mongooseQuery[key] = queryBuilderParser(value);
      } else if (key === '$eq') {
        mongooseQuery[key] = value;
      } else if (key === '$ne') {
        mongooseQuery[key] = { $ne: value };
      } else if (key === '$in') {
        mongooseQuery[key] = { $in: value };
      } else if (key === '$nin') {
        mongooseQuery[key] = { $nin: value };
      } else {
        // Handle other conditions as needed
        mongooseQuery[key] = value;
      }
    });
  }

  return mongooseQuery;
};

// Your sortParser function
const sortParser = (input) => {
  const newSortedObject = [];
  if (input) {
    Object.entries(input).forEach(([key, value]) => {
      if (value === 1) {
        newSortedObject.push([key, '1']);
      } else if (value === -1) {
        newSortedObject.push([key, '-1']);
      }
    });
  }
  return newSortedObject;
};
module.exports.createOne = createOne;
module.exports.createMany = createMany;
module.exports.update = update;
module.exports.destroy = destroy;
module.exports.findOne = findOne;
module.exports.paginate = paginate;
module.exports.findAll = findAll;
module.exports.count = count;
module.exports.upsert = upsert;
module.exports.updateOne = updateOne;
module.exports.queryBuilderParser = queryBuilderParser;
module.exports.sortParser = sortParser;
module.exports.findOneSelected = findOneSelected;
