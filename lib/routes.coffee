User = require "./models/user"
Stage = require "./models/stage"
Comment = require "./models/comment"
pusher = require "./pusher"


opentok = require 'opentok'
OPENTOK_API_KEY = '3703831'
OPENTOK_API_SECRET = '07f243ac253b365d2410c2cbc617b468cab49450'
ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)

exports.run = (express, app) ->
  app.use (req, res, next) ->
    res.local 'pusher', pusher
    next()

  app.get "/", (req, res) ->
    res.redirect "/stages"

  app.get "/stages", (req, res) ->
    Stage.find {}, (err, stages) ->
      res.render "stages/index", stages: stages

  app.get "/stages/new", (req, res) ->
    res.render "stages/new"

  app.post "/stages", (req, res) ->
    stage = new Stage req.param("stage")
    stage.save (err) ->
      res.redirect "/stages/#{stage.stub}"

  app.get "/stages/:stub", (req, res) ->
    Stage.findOne stub: req.param("stub"), (err, stage) ->
      otToken = ot.generateToken
        'connection_data': "userid_#{new Date().getTime()}",
        'role': "publisher"
      res.render "homepage", stage: stage, otToken: otToken