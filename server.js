require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
// const dns = require('dns');
// dns.setDefaultResultOrder('ipv4first');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")));
const connectDB = require('./config/db')

const authRoute = require('./routes/authRoute');
const courseRoute = require('./routes/courseRoute');




// Routes
app.use('/api/auth', authRoute);
app.use('/api/courses', courseRoute);



  connectDB().then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((error) => {
    console.error(error.message);
  });

