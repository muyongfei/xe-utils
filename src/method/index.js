'use strict'

var { objectAssign } = require('./base')
var arrayExports = require('./array')
var baseExports = require('./base')
var browseExports = require('./browse')
var cookieExports = require('./cookie')
var dateExports = require('./date')
var locatExports = require('./locat')
var numberExports = require('./number')
var stringExports = require('./string')
var methodExports = {}

objectAssign(
  methodExports,
  arrayExports,
  baseExports,
  browseExports,
  cookieExports,
  dateExports,
  locatExports,
  numberExports,
  stringExports
)

module.exports = methodExports
