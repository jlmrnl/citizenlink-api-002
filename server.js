const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const SeniorFormsRoutes = require('./src/routes/SeniorFormsRoutes');
const _4PsFormsRoutes = require('./src/routes/_4PsFormsRoutes');
const { connectToMongoDB } = require('./src/config/mongodbConfig');
const { handleMongoDBError } = require('./src/utils/errorHelpers');

const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/senior', SeniorFormsRoutes);
app.use('/api/4ps', _4PsFormsRoutes);
app.use('/uploads', express.static('uploads'));

connectToMongoDB()
  .then((port) => {
    console.log(`Server is running on port ${port}`);
  })
  .catch(handleMongoDBError);

//test