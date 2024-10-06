const mongoose = require('mongoose');
const statusValues = ['Employed', 'Interview', 'Declined', 'Pending'];
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: [50, 'Company name cannot exceed 50 characters'],
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: [100, 'Position name cannot exceed 50 characters'],
    },
    status: {
    type: String,
    enum: {
      values: statusValues,
      message: (props) => `${props.value} is not valid. Valid values: ${statusValues.join(', ')}`
    },
    default: 'Pending',
  },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, 'Please provide user'],
    }
  },
  {timestamps: true},
)

module.exports = mongoose.model('Job', JobSchema )