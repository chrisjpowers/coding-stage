exports.run = (express, app) ->
  oneYear = 31557600000
  app.use express.static("#{__dirname}/../../public", maxAge: oneYear)
  app.use express.errorHandler()
