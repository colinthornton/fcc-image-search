const express = require('express');
const axios = require('axios');
const app = express();

const API_KEY = 'AIzaSyCAdpVRyNo83GCvpA1EXCU_oUJV3j3wmsY';
const SEARCH_ENGINE_ID = '000418693802840694674:ldz-djbro9q';
const URL = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&searchType=image&q=`

app.get('/:query', (req, res) => {
  axios.get(URL + req.params.query)
    .then(response => {
      response.data.items.forEach(image => {
        console.log(image.title);
      });
    })
    .catch(error => {
      console.log(error);
    });
  res.send(URL + req.params.query);
});

app.listen(process.env.PORT || 8080, () => console.log('Server running...'));
