const mongoose = require('mongoose');

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
      enum:{
       values: ['Employed', 'Interview', 'Declined', 'Pending'],
       message: '{VALUE} is not valid'
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