mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
_ = require "underscore"

opentok = require 'opentok'
OPENTOK_API_KEY = '3703831'
OPENTOK_API_SECRET = '07f243ac253b365d2410c2cbc617b468cab49450'
ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)

Comments = new Schema
  message:
    type: String
  author:
    type: String

Watchers = new Schema
  name:
    type: String
  watcherId:
    type: Number

Stage = new Schema
  name:
    type: String
  creatorId:
    type: ObjectId
  language:
    type: String
  contributorIds:
    type: Array
  comments: [Comments]
  watchers: [Watchers]
  channel:
    type: String
  stub:
    type: String
  content:
    type: String
    
Stage.pre "save", (next) ->
  if this.get("channel")
    next()
  else
    stage = this
    ot.createSession 'localhost', {}, (session) ->
      stage.channel = session.sessionId
      next()

Stage.pre "save", (next) ->
  if this.get "stub"
    next()
  else
    this.stub = this.name.toLowerCase().replace /\W+/g, "-"
    next()

Stage.methods.addWatcher = (data) ->
  this.watchers ?= []
  if _.detect(this.watchers, (watcher) -> "" + watcher.watcherId == "" + data.id)
    return false
  else
    this.watchers.push name: data.name, watcherId: data.id
    return true

Stage.methods.removeWatcher = (id) ->
  id = id + ""
  this.watchers = _.reject this.watchers, (watcher) -> "" + watcher.watcherId == id

Stage.methods.addComment = (data) ->
  this.comments ?= []
  this.comments = [author: data.author, message: data.message].concat this.comments

module.exports = mongoose.model 'Stage', Stage
