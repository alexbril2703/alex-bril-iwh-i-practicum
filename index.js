const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

const OBJECT_TYPE = '2-58885757';

app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name&properties=type&properties=age`;

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const resp = await axios.get(url, { headers });

    console.log(JSON.stringify(resp.data.results, null, 2));

    res.render('homepage', {
      title: 'Pets Overview',
      data: resp.data.results
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Fout bij ophalen van custom object data.');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

  const newObject = {
    properties: {
      name: req.body.name,
      type: req.body.type,
      age: req.body.age
    }
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, newObject, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Fout bij aanmaken van custom object record.');
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));