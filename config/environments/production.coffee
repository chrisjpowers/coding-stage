mongoose = require "mongoose"

exports.run = (express, app) ->
  oneYear = 31557600000
  app.use express.static("#{__dirname}/../../public", maxAge: oneYear)
  app.use express.errorHandler()
  mongoose.connect "mongodb://#{process.env.MONGO_USER}:#{process.env.MONGO_PASSWORD}@staff.mongohq.com:10023/codingstage"
