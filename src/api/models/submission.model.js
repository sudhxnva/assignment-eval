const mongoose = require('mongoose');

/**
 * Submission Schema
 * @private
 */
const submissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 128,
      index: true,
      trim: true,
    },
    studentId: String,
    assignmentId: String,
    submissionId: String,
    score: Number,
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Submission
 */
module.exports = mongoose.model('Submission', submissionSchema);
