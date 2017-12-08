const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'AIzaSyCAdpVRyNo83GCvpA1EXCU_oUJV3j3wmsY';
const SEARCH_ENGINE_ID = '000418693802840694674:ldz-djbro9q';
const URL = 'https://www.googleapis.com/customsearch/v1';

app.get('/api/:query', (req, res) => {
  const json = [];
  const params = {
    key: API_KEY,
    cx: SEARCH_ENGINE_ID,
    searchType: 'image',
    q: req.params.query,
  }
  if (req.query.offset) {
    params.start = req.query.offset;
  }

  axios.get(URL, { params })
    .then(response => {
      response.data.items.forEach(image => {
        json.push({
          title: image.title,
          url: image.link,
          context: image.image.contextLink,
        });
      });
      res.json(json);
    })
    .catch(error => {
      console.log(error);
      res.json({
        error: true,
      });
    });
});

app.listen(process.env.PORT || 8080, () => console.log('Server running...'));
