User = require "models/user"
Stage = require "models/stage"
TokBox = require "tokbox"
pusher = require "pusher"

exports.run = (express, app) ->
  app.use (req, res, next) ->
    res.local 'pusher', pusher
    next()

  app.get "/", (req, res) ->
    res.render "front"

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
      otToken = TokBox.generateToken
        'connection_data': "userid_#{new Date().getTime()}",
        'role': "publisher"
      res.render "homepage", stage: stage, otToken: otToken, otKey: TokBox.key
