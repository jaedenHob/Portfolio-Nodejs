// import packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

const dbURI = process.env.MONGODB_URI;

var port = 8080;

if (process.argv.length == 3) {
    port = process.argv[2];
} 

// middleware to enable CORS for all routes
app.use(cors());

// middleware to parse JSON
app.use(express.json());

// for connecting to a MongoDB atlas cluster
// that will store the data from forms
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Mongoose model to define the schema
const contactSchema = new mongoose.Schema({
    // Define your schema based on the structure of the JSON data
    // For example, if the JSON has a "name" and "email" field:
    name: String,
    phone: String,
    email: String,
    subject: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

const allowedSite = 'https://jaedenhob.github.io/Portfolio-deploy/';

app.get('/test', (req, res) => {
    res.json({ message: 'Good we are aple to reach the server' });
})

app.post('/contact', async (req, res) => {
    const data = req.body;

    try {
        // Create a new contact document and save it to the database
        const contact = new Contact(data);

        const savedContact = await contact.save();

        res.json({message: 'Form recieved and data saved'});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Error saving data'});
    }
});



app.listen(port, () => console.log('Example app is listening on port ' + port));
