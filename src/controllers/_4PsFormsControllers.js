const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _4ps_records = require("../models/_4PsFormsSchema");
const _4ps = require("../models/_4psUserSchema");
const Senior_records = require("../models/SeniorFormsSchema");
const Admin_profile = require('../models/LGUprofileSchema');
const { sendEmail } = require('../middleware/nodemailerMiddleware');
const {
  handleServerError,
  handleNotFoundError,
} = require("../utils/errorHelpers");

const submitForm = async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

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
    
    const createdBy = req.name;
    const email = formData.email;
    const hashedPassword = await bcrypt.hash("123", 10);

    // Ensure email is provided and not null
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

    // Determine the prefix based on the barangay
    let prefix = "4ps05-"; 
    if (formData.barangay === "San Isidro Norte") {
      prefix = "4ps30-";
    }

    let userIdExists = true;
    let userId;
    let identifier;

    // Keep generating unique userIds until one doesn't exist in the database
    while (userIdExists) {
      // Generate the next unique identifier
      const userCount = await _4ps.countDocuments();
      identifier = String(userCount + 1).padStart(5, "0");

      // Construct the userId
      userId = prefix + identifier;

      console.log("Generated userId:", userId); // Log generated userId

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
      formData.lastname,
      formData.suffix,
    ].filter(Boolean).join(" ");

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

    try {
      // Create a new form instance with the form data
      const newForm = new _4ps_records(formData);
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

      console.log("Recipient email:", email);
      await sendEmail(
        email,
        "CitizenLink Registration for 4Ps",
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

const getAllForms = async (req, res) => {
  try {
    const forms = await _4ps_records.find();
    res.json(forms);
  } catch (error) {
    handleServerError(res, error);
  }
};

const getFormById = async (req, res) => {
  try {
    const form = await _4ps_records.findById(req.params.id);
    if (!form) {
      return handleNotFoundError(res, "Form not found");
    }
    res.json(form);
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateFormById = async (req, res) => {
  try {
    const form = await _4ps_records.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return handleNotFoundError(res, "Form not found");
    }
    res.json(form);
  } catch (error) {
    handleServerError(res, error);
  }
};

const deleteFormById = async (req, res) => {
  try {
    const form = await _4ps_records.findByIdAndDelete(req.params.id);
    if (!form) {
      return handleNotFoundError(res, "Form not found");
    }
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    handleServerError(res, error);
  }
};

module.exports = {
  submitForm,
  getAllForms,
  getFormById,
  updateFormById,
  deleteFormById,
};
