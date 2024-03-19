const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const Senior_records = require("../models/SeniorFormsSchema");
const Senior = require("../models/seniorUserSchema");
const _4ps_records = require('../models/_4PsFormsSchema');
const Admin_profile = require('../models/LGUprofileSchema');
const { configureMulter } = require('../utils/multerHelpers')
const {
  handleServerError,
  handleNotFoundError,
} = require("../utils/errorHelpers");

const upload = configureMulter();

const submitForm = async (req, res) => {
  let session; // Declare session variable outside try-catch block

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const formData = req.body;
    const createdBy = req.name;
    const hashedPassword = await bcrypt.hash("123", 10);

    // Ensure email is provided and not null
    const email = formData.email;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if email exists in any of the schemas
    const emailExists = await Promise.any([
      _4ps_records.exists({ email }),
      Senior_records.exists({ email }),
      Admin_profile.exists({ email })
    ]);
    if (emailExists) {
      console.log('Email already exists');
      return res.status(400).json({ error: "Email already exists" });
    }

    // Ignore null email values
    if (email === null) {
      console.log('Email is null, ignoring the record');
      return res.status(400).json({ error: "Email cannot be null" });
    }

    const oscaId = formData.oscaId;
    // Check if OSCA ID already exists
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

    // Multer middleware for handling picture upload
    upload.single('picture')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Failed to upload picture' });
      }

      // Add picture field to formData
      formData.picture = req.file ? req.file.path : null;

      try {
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
    });
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
    upload.single('picture')(req, res, async (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Failed to upload picture' });
      }

      // Check if picture is uploaded and update req.body with picture path
      if (req.file) {
        req.body.picture = req.file.path;
      }

      const updatedFormEntry = await Senior_records.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedFormEntry) {
        return handleNotFoundError(res, "Form entry not found");
      }
      res.status(200).json(updatedFormEntry);
    });
  } catch (error) {
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
