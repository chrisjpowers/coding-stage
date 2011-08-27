AppConfig = require "./app-config"

mongoose = require "mongoose"
mongooseTypes = require "mongoose-types"
mongooseTypes.loadTypes mongoose


mongoose.connect AppConfig.mongoUrl
