mongoose = require "mongoose"

exports.run = (express, app) ->
  app.use express.static("#{__dirname}/../../public")
  app.use express.errorHandler(dumpExceptions: true, showStack: true)

  mongoose.connect "mongodb://localhost/coding-stage"
