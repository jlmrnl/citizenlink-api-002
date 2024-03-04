const path = require('path');
const fs = require('fs').promises;
const SeniorFormsModels = require('../models/SeniorFormsSchema');
const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');

const submitForm = async (req, res) => {
  try {
    const formData = req.body;
    const createdBy = req.name;
    formData.createdBy = createdBy; // Assign the userId to createdBy

    if (req.file) {
      // If an image is uploaded, store the file path
      formData.picture = path.join('uploads', req.file.filename);
    }

    const newFormEntry = await SeniorFormsModels.create(formData);
    console.log(`${createdBy} created a record`);
    res.status(201).json(newFormEntry);
  } catch (error) {
    handleServerError(res, error);
  }
}

const getAllEntries = async (req, res) => {
  try {
    const allFormEntries = await SeniorFormsModels.find();
    res.status(200).json(allFormEntries);
  } catch (error) {
    handleServerError(res, error);
  }
}

const getEntryById = async (req, res) => {
  try {
    const formEntry = await SeniorFormsModels.findById(req.params.id);
    if (!formEntry) {
      return handleNotFoundError(res, 'Form entry not found');
    }
    res.status(200).json(formEntry);
  } catch (error) {
    handleServerError(res, error);
  }
}

const updateEntry = async (req, res) => {
  try {
    const updatedFormEntry = await SeniorFormsModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFormEntry) {
      return handleNotFoundError(res, 'Form entry not found');
    }
    res.status(200).json(updatedFormEntry);
  } catch (error) {
    handleServerError(res, error);
  }
}

const deleteEntry = async (req, res) => {
  try {
    const deletedFormEntry = await SeniorFormsModels.findByIdAndDelete(req.params.id);
    if (!deletedFormEntry) {
      return handleNotFoundError(res, 'Form entry not found');
    }
    res.status(200).json({ message: 'Form entry deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = { submitForm, getAllEntries, getEntryById, updateEntry, deleteEntry };
