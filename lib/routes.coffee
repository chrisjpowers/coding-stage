User = require "./models/user"
Stage = require "./models/stage"
Comment = require "./models/comment"

opentok = require 'opentok'
OPENTOK_API_KEY = '3703831'
OPENTOK_API_SECRET = '07f243ac253b365d2410c2cbc617b468cab49450'
ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)

exports.run = (express, app) ->
  app.get "/", (req, res) ->
    res.render "homepage"

  app.get "/stages/:stub", (req, res) ->
    Stage.findOne stub: req.param("stub"), (err, stage) ->
      otToken = ot.generateToken
        'connection_data': "userid_#{new Date().getTime()}",
        'role': "publisher"
      res.render "stage", stage: stage, otToken: otToken
