const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Senior = require('./src/routes/SeniorFormsRoutes');
const FourPs = require('./src/routes/_4PsFormsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const SMTP = require('./src/routes/SMTPRoutes')
const linkRoutes = require('./src/routes/CMS');
const { connectToMongoDB } = require('./src/config/mongodbConfig');

const app = express();

require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/senior', Senior);
app.use('/api/4ps', FourPs);
app.use('/api/lgu', authRoutes);
app.use('/api/smtp', SMTP);
app.use('/api/link', linkRoutes);
app.use('/uploads', express.static('uploads'));

connectToMongoDB()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });