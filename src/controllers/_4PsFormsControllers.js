const FourPsFormsModel = require('../models/_4PsFormsModels');

async function submitForm(req, res) {
  try {
    const formData = req.body;
    const newForm = new FourPsFormsModel(formData);
    await newForm.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllForms(req, res) {
  try {
    const forms = await FourPsFormsModel.find();
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getFormById(req, res) {
  try {
    const form = await FourPsFormsModel.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateFormById(req, res) {
  try {
    const form = await FourPsFormsModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteFormById(req, res) {
  try {
    const form = await FourPsFormsModel.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { submitForm, getAllForms, getFormById, updateFormById, deleteFormById };
