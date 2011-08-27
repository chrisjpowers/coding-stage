User = require "./models/user"
Stage = require "./models/stage"
Comment = require "./models/comment"

exports.run = (express, app) ->
  app.get "/", (req, res) ->
    res.render "homepage"
