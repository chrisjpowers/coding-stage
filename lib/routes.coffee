User = require "models/user"
Stage = require "models/stage"
TokBox = require "tokbox"
pusher = require "pusher"

exports.run = (express, app) ->
  app.use (req, res, next) ->
    res.locals pusher: pusher
    next()

  app.get "/", (req, res) ->
    res.render "front"

  app.get "/stages", (req, res) ->
    Stage.find {}, (err, stages) ->
      res.render "stages/index", stages: stages

  app.get "/stages/new", (req, res) ->
    res.render "stages/new"

  app.post "/stages", (req, res) ->
    atts = req.param("stage")
    atts.creatorId = req.user.id
    atts.batonHolderId = req.user.id
    stage = new Stage atts
    stage.save (err) ->
      console.log "ERROR CREATING STAGE", err if err
      res.redirect "/stages/#{stage.stub}"

  app.get "/stages/:stub", (req, res) ->
    Stage.findOne stub: req.param("stub"), (err, stage) ->
      if stage
        otToken = TokBox.generateToken
          'connection_data': "userid_#{new Date().getTime()}",
          'role': "publisher"
        stage.allContributors (contributors) ->
          res.render "homepage", stage: stage, otToken: otToken, otKey: TokBox.key, contributors: contributors
      else
        res.render status: 404

  app.get "/support", (req, res) ->
    res.render "support"
