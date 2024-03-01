const mongoose = require('mongoose');
const _4ps_records = require('../models/_4PsFormsSchema');

const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');

async function submitForm(req, res) {
  try {
    const formData = req.body;
    // Ensure userId is converted to ObjectId
    const createdBy = req.name;
    console.log('A user had logged:', createdBy);
    formData.createdBy = createdBy; // Assign the userId to createdBy
    const newForm = new _4ps_records(formData);
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    handleServerError(res, error);
  }
}


async function getAllForms(req, res) {
  try {
    const forms = await _4ps_records.find();
    res.json(forms);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getFormById(req, res) {
  try {
    const form = await _4ps_records.findById(req.params.id);
    if (!form) {
      return handleNotFoundError(res, 'Form not found');
    }
    res.json(form);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function updateFormById(req, res) {
  try {
    const form = await _4ps_records.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return handleNotFoundError(res, 'Form not found');
    }
    res.json(form);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function deleteFormById(req, res) {
  try {
    const form = await _4ps_records.findByIdAndDelete(req.params.id);
    if (!form) {
      return handleNotFoundError(res, 'Form not found');
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = { submitForm, getAllForms, getFormById, updateFormById, deleteFormById };
