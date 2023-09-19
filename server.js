const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const AWS = require('aws-sdk');
const app = express();
const port = 80;
require('dotenv').config();



// Dummy database for demonstration purposes
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create a DynamoDB client
const dynamodb = new AWS.DynamoDB();

// Define your DynamoDB table name
const tableName = 'YourDynamoDBTableName';


const users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Define the path to the parent directory of server.js
const parentDirectory = path.join(__dirname, '.');


// Serve static files from the 'public' directory in the parent directory
app.use(express.static(path.join(parentDirectory, 'frontend', 'public')));

// Routes

// Welcome page
app.get('/', (req, res) => {
  res.sendFile(path.join(parentDirectory, 'frontend', 'public', 'index.html'));
});

// Login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(parentDirectory, 'frontend', 'public', 'login.html'));
});

// Login POST endpoint (authentication logic goes here)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  // Add your authentication logic here
});

// Signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(parentDirectory, 'frontend', 'public', 'signup.html'));
});

// Signup POST endpoint (user registration logic goes here)
app.post('/signup', (req, res) => {
  const {username, email, password} = req.body;
  console.log(req.body)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
