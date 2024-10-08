const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
  const customObjectsApiUrl = 'https://api.hubspot.com/crm/v3/objects/books?properties=book_name,author,price';
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


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// Route to render update custom object form
app.get('/update-cobj', (req, res) => {
  const pageTitle = 'Update Custom Object Form | Integrating With HubSpot I Practicum';
  res.render('updates', { title: pageTitle });
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { book_name, author, price } = req.body;

    const newBook = {
        properties: {
            book_name: book_name,
            author: author,
            price: price
        }
    };

    const createBookApiUrl = 'https://api.hubspot.com/crm/v3/objects/books';

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


/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));