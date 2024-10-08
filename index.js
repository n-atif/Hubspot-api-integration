const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// Serve manifest.json
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Serve service-worker.js
app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'service-worker.js'));
});

// Route to render homepage with custom object data
app.get('/', async (req, res) => {
  const customObjectsApiUrl = 'https://api.hubapi.com/crm/v3/objects/books?properties=book_name,author,price';
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try {
      const resp = await axios.get(customObjectsApiUrl, { headers });
      const customObjectsData = resp.data.results;

      res.render('homepage', {
          title: 'Homepage | HubSpot CRM Records',
          customObjects: customObjectsData
      });
  } catch (error) {
      console.error('Error fetching custom objects data:', error.response?.data || error.message);
      res.status(500).send('Error fetching custom objects data from HubSpot');
  }
});

// Route to render update custom object form
app.get('/update-cobj', (req, res) => {
  const pageTitle = 'Update Custom Object Form | Integrating With HubSpot I Practicum';
  res.render('updates', { title: pageTitle });
});

// Route to handle form submission and create/update custom object
app.post('/update-cobj', async (req, res) => {
    const { book_name, author, price } = req.body;

    const newBook = {
        properties: {
            book_name: book_name,
            author: author,
            price: price
        }
    };

    const createBookApiUrl = 'https://api.hubapi.com/crm/v3/objects/books';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createBookApiUrl, newBook, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating new custom object:', error.response?.data || error.message);
        res.status(500).send('Error creating new custom object in HubSpot');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));