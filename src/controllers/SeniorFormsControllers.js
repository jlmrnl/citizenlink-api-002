const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const Senior_records = require('../models/SeniorFormsSchema');
const Senior = require('../models/seniorUserSchema');
const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');

const submitForm = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const formData = req.body;
    const createdBy = req.name;

    // Check if formData.password exists and is not empty
    if (!formData.password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Determine the prefix based on the barangay
    let prefix = 'sen05-'; // Default prefix for seniors
    if (formData.barangay === 'San Isidro Norte') {
      prefix = 'sen30-';
    }

    let userIdExists = true;
    let userId;
    let identifier;

    // Keep generating unique userIds until one doesn't exist in the database
    while (userIdExists) {
      // Generate the next unique identifier
      const userCount = await Senior.countDocuments();
      identifier = String(userCount + 1).padStart(5, '0');

      // Construct the userId
      userId = prefix + identifier;

      console.log('Generated userId:', userId); // Log generated userId

      // Check if the userId already exists in the database
      const existingUser = await Senior.findOne({ userId });

      if (!existingUser) {
        // If userId doesn't exist, exit the loop
        userIdExists = false;
      }
    }

    // Combine name fields
    const fullName = [
      formData.firstName,
      formData.middleName,
      formData.lastName,
      formData.suffix
    ].filter(Boolean).join(' ');

    // Create a new user instance with the user data
    const newUser = new Senior({
      userId,
      password: hashedPassword,
      name: fullName
    });

    // Assign the createdBy field to the userId of the user who submitted the form
    formData.createdBy = createdBy;
    formData.user = newUser._id;
    formData.userId = userId;

    // Create a new form instance with the form data
    const newForm = new Senior_records(formData);
    await newForm.save({ session });

    // Store the ObjectId of the created senior form record in the records field of the user
    newUser.records = newForm._id;
    await newUser.save({ session });

    console.log(`${createdBy} created a record`);
    await session.commitTransaction();
    res.status(201).json(newForm);
  } catch (error) {
    await session.abortTransaction();
    handleServerError(res, error);
  } finally {
    session.endSession();
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
