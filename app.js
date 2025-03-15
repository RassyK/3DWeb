const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Define a schema and model for user data
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Routes for the pages
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/3dmodel', (req, res) => {
  res.render('model', { title: '3D Model' });
});

// Route to display the form
app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

// Route to handle form submission
app.post('/signup', (req, res) => {
  const { name, email } = req.body;
  const newUser = new User({ name, email });
  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving user data');
    } else {
      res.redirect('/');
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});