const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _4ps_records = require('../models/_4PsFormsSchema');
const Citizen = require('../models/citizenUserSchema');

const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');



async function submitForm(req, res) {
  try {
    const formData = req.body;
    const createdBy = req.name; // Assuming user ID is available in the request

    // Hash the password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Determine the prefix based on the barangay
    let prefix = 'cit05-';
    if (formData.barangay === 'San Isidro Norte') {
      prefix = 'cit30-';
    }

    // Generate the next unique identifier
    const userCount = await Citizen.countDocuments();
    const identifier = String(userCount + 1).padStart(5, '0');

    // Construct the userId
    const userId = prefix + identifier;

    // Combine name fields
    const fullName = [
      formData.firstname,
      formData.middlename,
      formData.surname,
      formData.suffix
    ].filter(Boolean).join(' ');

    // Create a new user instance with the user data
    const newUser = new Citizen({ 
      userId, 
      password: hashedPassword,
      name: fullName
    });

    // Save the new user to the database
    await newUser.save();

    // Assign the createdBy field to the userId of the user who submitted the form
    formData.createdBy = createdBy;

    // Set the user reference in the form
    formData.user = newUser._id;

    // Set the generated userId on the form data
    formData.userId = userId;

    // Create a new form instance with the form data
    const newForm = new _4ps_records(formData);

    // Save the new form to the database
    await newForm.save();

    console.log(`${createdBy} created a record`);
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
