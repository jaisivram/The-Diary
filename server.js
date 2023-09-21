const express = require('express');
const https = require('https'); // Add this line for HTTPS
const fs = require('fs'); // Add this line to read the certificate and key files
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 443; 
require('dotenv').config();


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
  console.log(req.body);
  // Add your authentication logic here
});

// Signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(parentDirectory, 'frontend', 'public', 'signup.html'));
});

// Signup POST endpoint (user registration logic goes here)
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  console.log(req.body);
});

// Create an HTTPS server with your SSL certificate and key
const server = https.createServer({
  key: fs.readFileSync('/ssl/key.pem'),
  cert: fs.readFileSync('/ssl/cert.crt'),
}, app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
