require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const validUrl = /https?:\/\/.*/
let counter = 0
let urlMap = {}
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/', bodyParser.urlencoded({extended: false}))

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url?', function(req, res) {
  // res.json({'site': urlMap[req.params.short_url]})
  res.redirect(urlMap[req.params.short_url])
})

app.post('/api/shorturl/:original_url?', function(req, res) {
  let received_url = req.body.url
  let short_url = counter
  urlMap[short_url] = received_url
  counter++
  if(!validUrl.test(received_url)) {
    return res.json({
      'error': 'invalid url'
    })
  }
  console.log(urlMap)
  
  res.json({
    'original_url': received_url,
    'short_url': short_url
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
