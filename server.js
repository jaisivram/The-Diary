const express = require('express');
const https = require('https'); // Add this line for HTTPS
const fs = require('fs'); // Add this line to read the certificate and key files
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 443; 


const dotenv = require('dotenv');
const envPath = path.resolve('/', 'ssl', '.env');
dotenv.config({ path: envPath });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));


// Define the path to the parent directory of server.js
const parentDirectory = path.join(__dirname, '.');

// Serve static files from the 'public' directory in the parent directory
app.use(express.static(path.join(parentDirectory, 'frontend', 'public')));


// DBMS
const salt = process.env.salt;
const mysql = require("mysql2"); 
const connection = mysql.createConnection({
  host: 'localhost',
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
});
connection.connect((err) => {
  if (!err) console.log("Connected to DB");
  if (err) console.log(err);
})

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
  const user = { username, password };
  const hashedPassword = hasher(user.password, salt);

  // Add your authentication logic here
  const authenticateQuery = "SELECT * FROM userdata WHERE username = ? AND passhash = ?";
  connection.query(authenticateQuery, [user.username, hashedPassword], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      // Authentication successful, redirect to youtube.com
      res.redirect('https://github.com/jaisivram');
    } else {
      // Authentication failed, redirect to the login page with an error message
      res.redirect('/login?error=incorrect-credentials');
    }
  });
});

// Signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(parentDirectory, 'frontend', 'public', 'signup.html'));
});

// Signup POST endpoint (user registration logic goes here)
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const user = { username, email, password };
  const hashedPassword = hasher(user.password, salt);

  // Check if a user with the same username or email already exists
  const checkUserQuery = "SELECT * FROM userdata WHERE  email = ?";
  connection.query(checkUserQuery, [user.email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      // User with the same username or email already exists
      res.status(400).send("User already exists. Please choose a different email.");
    } else {
      // Insert the new user into the database
      const insertUserQuery = "INSERT INTO userdata (username, email, passhash) VALUES (?, ?, ?)";
      connection.query(insertUserQuery, [user.username, user.email, hashedPassword], (insertErr, insertResults) => {
        if (insertErr) {
          console.error(insertErr);
          res.status(500).send("Internal Server Error");
          return;
        }

        // Redirect the user to the login page after successful registration
        res.redirect('/login');
      });
    }
  });
});


const crypto = require('crypto');

function hasher(inputString, salt) {
  const cipher = crypto.createCipher('aes-256-cbc', salt);
  let encrypted = cipher.update(inputString, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Create an HTTPS server with your SSL certificate and key
const server = https.createServer({
  key: fs.readFileSync('/ssl/key.pem'),
  cert: fs.readFileSync('/ssl/cert.crt'),
}, app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
