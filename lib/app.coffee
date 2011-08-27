require('nko')('2IXyUTQrpwP5nnHC')

express = require "express"
app = express.createServer()

app.set 'view engine', 'ejs'

app.get "/", (req, res) ->
  res.render "homepage"

app.listen

app.listen parseInt(process.env.PORT) || 8080
console.log "Listening on #{app.address().port}"

