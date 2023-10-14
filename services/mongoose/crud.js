const model = require('../../model/mongoose');
const mongooseService = require('../../utils/mongooseService');

/**
 * Service functions for MongoDB Mongoose model.
 */

// Create a new document
const createDocument = async (data) => {
    try {
        const document = new model.YourMongooseModel(data);
        const result = await document.save();
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Find a document by ID
const findDocumentById = async (documentId) => {
    try {
        const document = await model.YourMongooseModel.findById(documentId);
        return document;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Update a document by ID
const updateDocumentById = async (documentId, newData) => {
    try {
        const updatedDocument = await model.YourMongooseModel.findByIdAndUpdate(documentId, newData, { new: true });
        return updatedDocument;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Delete a document by ID
const deleteDocumentById = async (documentId) => {
    try {
        const deletedDocument = await model.YourMongooseModel.findByIdAndRemove(documentId);
        return deletedDocument;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Find documents based on a query
const findDocuments = async (query) => {
    try {
        const documents = await model.YourMongooseModel.find(query);
        return documents;
    } catch (error) {
        throw new Error(error.message);
    }
};

// Count documents based on a query
const countDocuments = async (query) => {
    try {
        const count = await model.YourMongooseModel.countDocuments(query);
        return count;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createDocument,
    findDocumentById,
    updateDocumentById,
    deleteDocumentById,
    findDocuments,
    countDocuments,
};
