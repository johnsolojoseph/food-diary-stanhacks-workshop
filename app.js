const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let foods = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/foods', async (req, res) => {
  const foodQuery = req.body.food;
  const note = req.body.note;

  const apiURL = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
    foodQuery
  )}&search_simple=1&action=process&json=1`;

  try {
    const response = await axios.get(apiURL);
    const product = response.data.products[0];

    if (product) {
      foods.push({
        name: product.product_name || foodQuery,
        calories: product.nutriments?.['energy-kcal'] || 'Unknown',
        image: product.image_url || '',
        note: note
      });
    }

    res.json({ foods });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching food data.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
