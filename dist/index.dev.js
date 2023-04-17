"use strict";

var express = require("express");

var app = express();

var loaders = require("./loaders"); // Init application loaders


loaders(app); // exported for Jest testing

module.exports = app;