const express = require('express')
const app = express()
const loaders = require('./loaders')

const path = require('path')
// Init application loaders
// app.use(express.static(path.join(__dirname, '/dist')))
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// app.use(express.static('dist'))
loaders(app)

// exported for Jest testing
module.exports = app
