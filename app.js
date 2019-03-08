'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
  res.send(req.body)
});



app.use(bodyParser.json());

module.exports = app;
module.exports.handler = serverless(app);