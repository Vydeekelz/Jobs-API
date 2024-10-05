const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')
const { NotFoundError } = require('../errors')
const { BadRequestError } = require('../errors')


const getAllJobs = async (req, res) => {
  const jobs = await Job.find({createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs, count: jobs.length })
}

const getSingleJob = async (req, res) => {
  const {
    params: {id: jobId},
    user: {userId} 
  } = req
  
  const job = await Job.findOne({ _id:jobId, createdBy: userId});
  if (!job) {
    throw new NotFoundError(`no job with job ID ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job: job})
}

const deleteJob = async (req, res) => {
  const {
    params: {id: jobId},
    user: {userId} 
  } = req

  const job = await Job.findOneAndDelete({ _id:jobId, createdBy: userId});
  if (!job) {
    throw new NotFoundError(`no job with job ID ${jobId}`)
  }
  res.status(StatusCodes.OK).json({job: job})
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId }
  } = req;

 
  // Check if the company or position fields are empty
  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }

  try {
    const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new NotFoundError(`No job found with ID ${jobId}`);
    }
    res.status(StatusCodes.OK).json(job);

  } catch (error) {
    throw error;
  }
};


const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({job});
}

module.exports = {getAllJobs, getSingleJob, deleteJob, createJob, updateJob}