mongoose = require "mongoose"
Schema = mongoose.Schema
ObjectId = Schema.ObjectId
_ = require "underscore"
require "models/user"

opentok = require 'opentok'
OPENTOK_API_KEY = '3703831'
OPENTOK_API_SECRET = '07f243ac253b365d2410c2cbc617b468cab49450'
ot = new opentok.OpenTokSDK(OPENTOK_API_KEY,OPENTOK_API_SECRET)

Comments = new Schema
  message:
    type: String
  author:
    type: String
  createdAt:
    type: Date

Watchers = new Schema
  name:
    type: String
  watcherId:
    type: Number

Stage = new Schema
  name:
    type: String
    required: true
  creatorId:
    type: ObjectId
  creatorName:
    type: String
  createdAt:
    type: Date
  batonHolderId:
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
    default: ""
    
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
  if _.detect(this.watchers, (watcher) -> "" + watcher.watcherId == "" + data.id || "" + watcher.name == "" + data.name )
    return false
  else
    this.watchers.push name: data.name, watcherId: data.id
    return true

Stage.methods.removeWatcher = (id) ->
  id = id + ""
  this.watchers = _.reject this.watchers, (watcher) -> "" + watcher.watcherId == id

Stage.methods.addComment = (data) ->
  this.comments ?= []
  this.comments = [author: data.author, message: data.message, createdAt: data.createdAt].concat this.comments

Stage.methods.getCreator = (callback) ->
  if this.creatorId
    User = mongoose.model "User"
    User.findById this.creatorId, (err, user) ->
      console.log "Error finding creator", err if err
      callback user
  else
    callback(null)

Stage.methods.allContributors = (callback) ->
  this.contributorIds ?= []
  ids = this.contributorIds.concat [this.creatorId]
  User = mongoose.model "User"
  console.log "Fetching user ids", ids
  User.find "_id": {"$in": ids}, (err, users) ->
    console.log "Error fetching contributors", err if err
    users ?= []
    callback users

module.exports = mongoose.model 'Stage', Stage
