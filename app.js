const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();

const API_KEY = 'AIzaSyCAdpVRyNo83GCvpA1EXCU_oUJV3j3wmsY';
const SEARCH_ENGINE_ID = '000418693802840694674:ldz-djbro9q';
const URL = 'https://www.googleapis.com/customsearch/v1';
const MLAB_URI = process.env.MLAB_URI;
const DEV_DB = 'mongodb://localhost:27017';

app.use(express.static(__dirname + '/public'));
mongoose.connect(MLAB_URI || DEV_DB, { useMongoClient: true });

const searchSchema = new mongoose.Schema({
  query: String,
  time: String,
});
const Search = mongoose.model('Search', searchSchema);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/:query', (req, res) => {
  const newSearch = {
    query: req.params.query,
    time: new Date().toString(),
  };
  Search.create(newSearch, (err, search) => {
    if (err) {
      return console.log(err);
    }
    console.log(`New search "${search.query}" created.`);
  });

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
      const json = [];
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
      res.json({ error: true, });
    });
});

app.get('/recent', (req, res) => {
  Search.find({}, '-_id query time')
    .sort({ _id: -1 })
    .limit(10)
    .exec((err, recentSearches) => {
      if (err) {
        console.log(err);
        return res.json({ error: true });
      }
      res.json(recentSearches);
    });
});

app.listen(process.env.PORT || 8080, () => console.log('Server running...'));
