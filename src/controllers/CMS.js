const mongoose = require("mongoose");
const Link = require('../models/CMS');

// Create a new link
const createLink = async (req, res) => {
    try {
        const link = await Link.create(req.body);
        res.status(201).json( link );
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// Get all links
const getLinks = async (req, res) => {
    try {
        const links = await Link.find();
        res.status(200).json( links );
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get a single link by ID
const getLinkById = async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        res.status(200).json( link );
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Update a link by ID
const updateLink = async (req, res) => {
    try {
        const link = await Link.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!link) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        res.status(200).json( link );
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Delete a link by ID
const deleteLink = async (req, res) => {
    try {
        const link = await Link.findByIdAndDelete(req.params.id);
        if (!link) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { createLink, updateLink, getLinkById, getLinks, deleteLink };