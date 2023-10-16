const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { TASK_STATUS, TASK_PRIORITY, TASK_REPETITION, TASK_TYPES } = require("../../../constants/schemaConstants");
const date = new Date()

const TaskSchema = new mongoose.Schema(
  {
    organizationID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    projectID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    boardID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
    },
    parentTaskID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    taskName: {
      type: String,
      maxlength: 1000,
      index: true,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    taskKey: {
      type: String,
      unique: true,
      required: true,
    },
    taskType: {
      type: String,
      enum: TASK_TYPES,
      default: TASK_TYPES[0],
    },
    comments: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      default: date
    },
    endDate: {
      type: Date,
      default: date
    },
    taskAssigneeID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportedID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tasgID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrganizationTag",
      },
    ],
    taskStatus: {
      type: String,
      enum: TASK_STATUS,
      default: TASK_STATUS[0],
    },
    taskPosition: {
      type: Number,
      default: 1,
    },
    taskPriority: {
      enum: TASK_PRIORITY,
      default: TASK_PRIORITY[0]
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    integrationPlatformID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IntegrationPlatform",
    },
    taskRepetition: {
      type: String,
      enum: TASK_REPETITION,
      default: TASK_REPETITION[0]

    }
  },
  {
    timestamps: true,
  }
);

TaskSchema.plugin(uniqueValidator);

TaskSchema.pre("save", async function (next) {
  if (this.isNew) {
    const randomPart = Math.random().toString(36).substring(2, 10);
    this.taskKey = this.taskName.replace(/\s+/g, '') + randomPart;
    const Task = mongoose.model("Task");
    let uniqueTaskKey = false;
    while (!uniqueTaskKey) {
      const existingTask = await Task.findOne({ taskKey: this.taskKey });
      if (!existingTask) {
        uniqueTaskKey = true;
      } else {
        const newRandomPart = Math.random().toString(36).substring(2, 10);
        this.taskKey = this.taskName.replace(/\s+/g, '') + newRandomPart;
      }
    }
  }

  next();
});

TaskSchema.index({ projectID: 1, taskType: 1 });
TaskSchema.index({ parentTaskID: 1 });

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
