const express = require('express');
const bodyParser = require('body-parser');
const pug = require('pug');
const monk = require('monk');
const os = require("os");

const config = require('./config/config.json');

var app = express();
var comments = monk(config.database).get('comments');

var serverHostname = os.hostname();


app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', (req, res) => {
  comments.find({}, {sort: {_id: -1}}).then((docs, err) => {
    res.render('index', {
      comments: docs,
      server: serverHostname
    });
  })
})

app.post('/comment', (req, res) => {
  comments.insert({
    comment: req.body.comment,
    name: req.body.name,
    server: serverHostname
  })
  res.redirect('/')
})


app.listen(8080);
