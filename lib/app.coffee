require('nko')('2IXyUTQrpwP5nnHC')
require "config/mongo"
routes = require 'lib/routes'
express = require "express"
everyauth = require 'everyauth'
mongooseAuth = require 'mongoose-auth'
everyauth.debug = true

app = express.createServer(
  express.bodyParser(),
  express.static(__dirname + "/public"),
  express.cookieParser(),
  express.session({ secret: 'esoognom'}),
  mongooseAuth.middleware()
)

app.set 'view engine', 'ejs'

app.configure () ->
  app.set "views", "#{__dirname}/../views"
  app.use express.methodOverride()
  app.use express.bodyParser()

app.configure 'development', () ->
  require("config/environments/development").run express, app
app.configure 'production', () ->
  require("config/environments/production").run express, app

mongooseAuth.helpExpress(app)
routes.run express, app

port = if process.env.NODE_ENV == "production" then 80 else 8080
app.listen port, '0.0.0.0'
console.log "Listening on #{app.address().port}"
