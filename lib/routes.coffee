User = require "models/user"
Event = require "models/event"
Stage = require "models/stage"
TokBox = require "tokbox"
pusher = require "pusher"
remotexec = require 'remotexec'

exports.run = (express, app) ->
  app.use (req, res, next) ->
    res.locals pusher: pusher
    next()

  app.post "/run", (req, res) ->
    remotexec
      json: JSON.stringify(req.body)
      timeout: ->
        res.end "Timeout"
      callback: (output) ->
        res.end output
      error: ->
        res.end "Error"

  getStagesAndEvents = (tpl, req, res) ->
    stages = []
    myStages = []
    events = []

    Event.find({}).desc("createdAt").limit(9).exec (err, events) ->
      Stage.find({}).desc("createdAt").limit(9).exec (err, stages) ->
        if req.loggedIn
          Stage.find creatorId: req.user.id, (err, myStages) ->
            res.render tpl, {
              stages: stages,
              myStages: myStages,
              events: events
            }
        else
          res.render tpl, {
            stages: stages,
            myStages: myStages,
            events: events
          }

  app.get "/", (req, res) ->
    getStagesAndEvents 'front', req, res

  app.get "/stages", (req, res) ->
    getStagesAndEvents 'stages/index', req, res

  app.get "/stages/new", (req, res) ->
    res.render "stages/new"

  app.post "/stages", (req, res) ->
    Stage.find name: req.body.stage.name, (err, stages) ->
      if stages.length > 0
        res.render "stages/new-error", err: "That name is taken"
      else
        atts = req.param("stage")
        atts.creatorId = req.user.id
        atts.batonHolderId = req.user.id
        atts.creatorName = req.user.github.name
        atts.createdAt = new Date()
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
          console.log "Contributors", contributors
          res.render "homepage", stage: stage, otToken: otToken, otKey: TokBox.key, contributors: contributors
      else
        res.render status: 404

  app.get "/support", (req, res) ->
    res.render "support"
