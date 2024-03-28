const path = require("path");
const mongoose = require("mongoose");
const moment = require('moment');
const { sendEmail } = require('../middleware/nodemailerMiddleware');
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const Senior_records = require("../models/SeniorFormsSchema");
const Senior = require("../models/seniorUserSchema");
const _4ps_records = require('../models/_4PsFormsSchema');
const Admin_profile = require('../models/LGUprofileSchema');
const multerMiddleware = require('../middleware/multerMiddleware');
const {
  handleServerError,
  handleNotFoundError,
} = require("../utils/errorHelpers");

const submitForm = async (req, res, next) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // Extract form data from request body
    const formData = req.body;

    // Initialize variables to store file paths
    let _1x1PicturePath = null;
    let validDocsPath = null;

    // Check if the '1x1Picture' field exists in req.files
    if (req.files && req.files['_1x1Picture'] && req.files['_1x1Picture'][0] && req.files['_1x1Picture'][0].path) {
      _1x1PicturePath = req.files['_1x1Picture'][0].path;
    }

    // Check if the 'validDocs' field exists in req.files
    if (req.files && req.files['validDocs'] && req.files['validDocs'][0] && req.files['validDocs'][0].path) {
      validDocsPath = req.files['validDocs'][0].path;
    }

    // Populate formData with paths of uploaded files
    formData._1x1Picture = _1x1PicturePath;
    formData.validDocs = validDocsPath;

    // Extract other necessary data
    const createdBy = req.name;
    const email = formData.email;
    const oscaId = formData.oscaId;
    const hashedPassword = await bcrypt.hash("123", 10);

    // Check if email exists in any of the schemas
    const emailExists = await Promise.any([
      _4ps_records.exists({ email }),
      Senior_records.exists({ email }),
      Admin_profile.exists({ email })
    ]);
    // Ensure email is provided and not null
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email is required" });
    }
    if (emailExists) {
      console.log('Email already exists');
      return res.status(400).json({ error: "Email already exists" });
    }

    // Ignore null email values
    if (email === null) {
      console.log('Email is null, ignoring the record');
      return res.status(400).json({ error: "Email cannot be null" });
    }

    const oscaIdExists = await Senior_records.exists({ oscaId });
    if (oscaIdExists) {
      console.log('OSCA ID already exists');
      return res.status(400).json({ error: "OSCA ID Already Exists" });
    }

    // Determine the prefix based on the barangay
    let prefix = "sen05-"; // Default prefix for seniors
    if (formData.barangay === "San Isidro Norte") {
      prefix = "sen30-";
    }

    let userIdExists = true;
    let userId;
    let identifier;

    // Keep generating unique userIds until one doesn't exist in the database
    while (userIdExists) {
      // Generate the next unique identifier
      const userCount = await Senior.countDocuments();
      identifier = String(userCount + 1).padStart(5, "0");

      // Construct the userId
      userId = prefix + identifier;

      console.log("Generated userId:", userId); // Log generated userId

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
      formData.suffix,
    ].filter(Boolean).join(" ");

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

    try {
      // Create a new form instance with the form data
      const newForm = new Senior_records(formData);
      await newForm.save({ session });

      // Store the ObjectId of the created senior form record in the records field of the user
      newUser.records = newForm._id;
      await newUser.save({ session });

      console.log(`${createdBy} created a record`);

      // Construct the HTML content for the email
      const html = `
        <p>Your registration was successful.</p>
        <p>Name: ${fullName}</p>
        <p>UserID: ${userId}</p>
      `;

      // Send the email
      await sendEmail(
        email,
        "CitizenLink Registration for Senior Citizen",
        html
      );

      await session.commitTransaction();
      res.status(201).json(newForm);
    } catch (error) {
      await session.abortTransaction();
      handleServerError(res, error);
    } finally {
      session.endSession();
    }
  } catch (error) {
    handleServerError(res, error);
    if (session) {
      session.endSession();
    }
  }
};


const getAllEntries = async (req, res) => {
  try {
    const allFormEntries = await Senior_records.find();
    res.status(200).json(allFormEntries);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getEntryById = async (req, res) => {
  try {
    const formEntry = await Senior_records.findById(req.params.id);
    if (!formEntry) {
      return handleNotFoundError(res, "Form entry not found");
    }
    res.status(200).json(formEntry);
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateEntry = async (req, res) => {
  try {
    // Initialize variables to store file paths
    let _1x1PicturePath = null;
    let validDocsPath = null;

    // Check if the '_1x1Picture' field exists in req.files
    if (req.files && req.files['_1x1Picture'] && req.files['_1x1Picture'][0] && req.files['_1x1Picture'][0].path) {
      _1x1PicturePath = req.files['_1x1Picture'][0].path;
    }

    // Check if the 'validDocs' field exists in req.files
    if (req.files && req.files['validDocs'] && req.files['validDocs'][0] && req.files['validDocs'][0].path) {
      validDocsPath = req.files['validDocs'][0].path;
    }

    // Update req.body with picture paths if corresponding files were uploaded
    if (_1x1PicturePath) {
      req.body._1x1Picture = _1x1PicturePath;
    }

    if (validDocsPath) {
      req.body.validDocs = validDocsPath;
    }

    const updatedFormEntry = await Senior_records.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedFormEntry) {
      return handleNotFoundError(res, "Form entry not found");
    }

    // Update updatedAt field with formatted date
    updatedFormEntry.updatedAt = moment().format('MM-DD-YYYY');

    // Add updatedBy field with name obtained from the token
    updatedFormEntry.updatedBy = req.name;
    
    await updatedFormEntry.save();

    res.status(200).json(updatedFormEntry);
  } catch (error) {
    // Handle unexpected errors
    handleServerError(res, error);
  }
};

const deleteEntry = async (req, res) => {
  try {
    const deletedFormEntry = await Senior_records.findByIdAndDelete(
      req.params.id
    );
    if (!deletedFormEntry) {
      return handleNotFoundError(res, "Form entry not found");
    }
    res.status(200).json({ message: "Form entry deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  submitForm,
  getAllEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
};
