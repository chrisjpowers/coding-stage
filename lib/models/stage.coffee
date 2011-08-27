mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
Comment = require "./comment"

opentok = require 'opentok'
OPENTOK_API_KEY = '3703831'
OPENTOK_API_SECRET = '07f243ac253b365d2410c2cbc617b468cab49450'
ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)

Stage = new Schema
  name:
    type: String
  creatorId:
    type: ObjectId
  language:
    type: String
  contributorIds:
    type: Array
  comments: [Comment]
  openTokSessionId:
    type: String
  stub:
    type: String
    
Stage.pre "save", (next) ->
  unless this.get("openTokSessionId")
    stage = this
    ot.createSession 'localhost', {}, (session) ->
      stage.openTokSessionId = session.sessionId
      next()

Stage.pre "save", (next) ->
  unless this.get "stub"
    this.stub = this.name.toLowerCase().replace /\W+/g, "-"

module.exports = mongoose.model 'Stage', Stage
