const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const URL = 'mongodb+srv://Jaygupta:Jaygupta@ecom.i8wuogo.mongodb.net/?retryWrites=true&w=majority&appName=ECOM';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
dotenv.config();
// app.use(fileUpload());
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON data
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', require('./routes/useRoutes'));
app.use('/api', require('./routes/CategoryRoutes'));
app.use('/api', require('./routes/ProductRoutes'));

mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

app.get('/', (req, res) => {
  res.send("hello friends ");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

