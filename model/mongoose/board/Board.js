/**
 * @module models/Board
 */

const mongoose = require("mongoose");

/**
 * Represents a Board.
 *
 * @typedef {Object} Board
 * @property {mongoose.Types.ObjectId} projectID - The ID of the project (a reference to the 'Project' model).
 * @property {string} boardName - The name of the project (maximum 200 characters).
 * @property {string} trelloIdModel - The ID of the trello.
 * @property {number} position - The position of the board.
 * @property {string} externalId - The ID of the external (like asana, jira etc).
 * @property {mongoose.Types.ObjectId} createdBy - The ID of the user who created the project (a reference to the 'User' model).
 * @property {mongoose.Types.ObjectId} updatedBy - The ID of the user who last updated the project (a reference to the 'User' model).
 * @property {boolean} isActive - Indicates whether the project is active (default is true).
 * @property {boolean} isDeleted - Indicates whether the project is deleted (default is false).
 * @property {Date} createdAt - The timestamp when the project was created (automatically managed by Mongoose).
 * @property {Date} updatedAt - The timestamp when the project was last updated (automatically managed by Mongoose).
 *
 * @class
 */

const BoardSchema = new mongoose.Schema(
  {
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    boardName: {
      type: String,
      maxlength: 1000,
      index: true,
      trim: true,
      required: true,
    },
    trelloIdModel: {
      type: String,
    },
    externalId: {
      type: String,
    },
    position: {
      type: Number,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
  },
  {
    timestamps: true,
  },
);

BoardSchema.set("toObject", { virtuals: true });
BoardSchema.set("toJSON", { virtuals: true });

BoardSchema.virtual("taskCount", {
  ref: "Activities",
  localField: "_id",
  foreignField: "boardId",
  options: {
    match: {
      subTask: { $exists: true, $eq: [] },
      status: "ACTIVE",
    },
  },
  count: true,
});

BoardSchema.virtual("taskList", {
  ref: "Activities",
  localField: "_id",
  foreignField: "boardId",
  options: {
    match: {
      $and: [
        {
          $or: [
            { subTask: { $exists: true, $eq: [] } },
            { subTask: { $exists: false } },
          ],
        },
        {
          $or: [
            { innerSubTask: { $exists: true, $eq: [] } },
            { innerSubTask: { $exists: false } },
          ],
        },
        { status: "ACTIVE" },
      ],
    },
    sort: { position: 1 },
  },
});
/**
 * Mongoose model for the 'Board' collection.
 *
 * @type {mongoose.Model<Board>}
 */
const board = mongoose.model('Board', BoardSchema);
board.syncIndexes();
module.exports = board;