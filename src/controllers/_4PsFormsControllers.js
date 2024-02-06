const FourPsFormsModel = require('../models/_4PsFormsModels');
const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');

async function submitForm(req, res) {
  try {
    const formData = req.body;
    const newForm = new FourPsFormsModel(formData);
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getAllForms(req, res) {
  try {
    const forms = await FourPsFormsModel.find();
    res.json(forms);
  } catch (error) {
    handleServerError(res, error);
  }
}

async function getFormById(req, res) {
  try {
    const form = await FourPsFormsModel.findById(req.params.id);
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
    const form = await FourPsFormsModel.findByIdAndUpdate(req.params.id, req.body, {
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
    const form = await FourPsFormsModel.findByIdAndDelete(req.params.id);
    if (!form) {
      return handleNotFoundError(res, 'Form not found');
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
}

module.exports = { submitForm, getAllForms, getFormById, updateFormById, deleteFormById };
