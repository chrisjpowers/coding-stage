require('nko')('2IXyUTQrpwP5nnHC')
require "config/mongo"
routes = require 'lib/routes'
express = require "express"
everyauth = require 'everyauth'
mongooseAuth = require 'mongoose-auth'
everyauth.debug = true

useDomain = (req, res, next) ->
  if process.env.NODE_ENV == "production"
    console.log req.headers.host
    if req.headers.host != "www.codingstage.com"
      res.statusCode = 301
      res.header('Location', "http://www.codingstage.com")
      res.end()
    else
      next()
  else
    next()
  next()

app = express.createServer(
  useDomain,
  express.bodyParser(),
  express.static(__dirname + "/public"),
  express.cookieParser(),
  express.session({ secret: 'esoognom'}),
  mongooseAuth.middleware()
)

app.set 'view engine', 'ejs'

app.helpers require("helpers")

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
