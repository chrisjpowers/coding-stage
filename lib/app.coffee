require('nko')('2IXyUTQrpwP5nnHC')
require "../config/mongo"

express = require "express"
app = express.createServer()

app.set 'view engine', 'ejs'

app.configure 'development', () ->
  require("../config/environments/development").run express, app
app.configure 'production', () ->
  require("../config/environments/production").run express, app

require("./routes").run express, app

port = parseInt(process.env.PORT) || 8080
app.listen port, '0.0.0.0'
console.log "Listening on #{app.address().port}"
