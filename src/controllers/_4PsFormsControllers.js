const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _4ps_records = require('../models/_4PsFormsSchema');
const _4ps = require('../models/_4psUserSchema');
const { handleServerError, handleNotFoundError } = require('../utils/errorHelpers');

const submitForm = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const formData = req.body;
    const createdBy = req.name;
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Determine the prefix based on the barangay
    let prefix = '4ps05-';
    if (formData.barangay === 'San Isidro Norte') {
      prefix = '4ps30-';
    }

    let userIdExists = true;
    let userId;
    let identifier;

    // Keep generating unique userIds until one doesn't exist in the database
    while (userIdExists) {
      // Generate the next unique identifier
      const userCount = await _4ps.countDocuments();
      identifier = String(userCount + 1).padStart(5, '0');

      // Construct the userId
      userId = prefix + identifier;

      console.log('Generated userId:', userId); // Log generated userId
      
      // Check if the userId already exists in the database
      const existingUser = await _4ps.findOne({ userId });

      if (!existingUser) {
        // If userId doesn't exist, exit the loop
        userIdExists = false;
      }
    }

    // Combine name fields
    const fullName = [
      formData.firstname,
      formData.middlename,
      formData.surname,
      formData.suffix
    ].filter(Boolean).join(' ');

    // Create a new user instance with the user data
    const newUser = new _4ps({ 
      userId, 
      password: hashedPassword,
      name: fullName
    });

    // Assign the createdBy field to the userId of the user who submitted the form
    formData.createdBy = createdBy;
    formData.user = newUser._id;
    formData.userId = userId;

    // Create a new form instance with the form data
    const newForm = new _4ps_records(formData);


   // Store the ObjectId of the created 4Ps record in the records field of the user
   newUser.records = newForm._id;

   await newForm.save({ session });

   // Store the ObjectId of the created senior form record in the records field of the user
   newUser.records = newForm._id;
   await newUser.save({ session });

   console.log(`${createdBy} created a record`);
   await session.commitTransaction();
   res.status(201).json({
        records: newForm,
        userId: userId
   });
 } catch (error) {
   await session.abortTransaction();
   handleServerError(res, error);
 } finally {
   session.endSession();
 }
}

const getAllForms = async (req, res) => {
  try {
    const forms = await _4ps_records.find();
    res.json(forms);
  } catch (error) {
    handleServerError(res, error);
  }
}

const getFormById = async (req, res) => {
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

const updateFormById = async (req, res) => {
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

const deleteFormById = async (req, res) => {
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
