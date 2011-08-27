AppConfig = require "./app-config"

mongoose = require "mongoose"
mongooseTypes = require "mongoose-types"
mongooseTypes.loadTypes mongoose

mongoose.connect AppConfig.mongoUrl
mongoose.connection.on "open", () -> console.log "Connection to Mongo is open!"
