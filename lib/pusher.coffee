Pusher = require "pusher-pipe"
AppConfig = require "config/app-config"
Stage = require "models/stage"
socketInfo = {}

console.log ">>> #{Stage}"

pipe = Pusher.createClient
  key: AppConfig.pusher.key,
  secret: AppConfig.pusher.secret,
  app_id: AppConfig.pusher.appId,
  debug: true

pipe.connect()

# pipe.sockets.on "open", (socket_id) ->
#   console.log "Connection! #{socket_id}"

pipe.sockets.on "close", (socket_id) ->
  if info = socketInfo[socket_id]
    pipe.channel(info.channel).trigger "watcher-left", id: info.id
    Stage.findOne channel: info.channel, (err, stage) ->
      if err || !stage
        console.log "Could not find stage", info.channel
      else
        stage.removeWatcher info.id
        stage.save (err) ->
          console.log "FAILED TO SAVE STAGE", err if err

pipe.channels.on "event:watcher-joining", (channelName, socket_id, data) ->
  socketInfo[socket_id] = channel: channelName, id: data.id
  Stage.findOne channel: channelName, (err, stage) ->
    if err
      console.log "Failed to find Stage for watcher", channelName, data
    else if stage && stage.addWatcher data
      pipe.channel(channelName).trigger "watcher-joined", name: data.name, id: data.id
      stage.save (err) ->

pipe.channels.on "event:adding-comment", (channelName, socket_id, data) ->
  data.createdAt = new Date()
  Stage.findOne channel: channelName, (err, stage) ->
    if err
      console.log "Failed to find Stage for watcher", channelName, data
    else if stage
      pipe.channel(channelName).trigger "added-comment", author: data.author, message: data.message, createdAt: data.createdAt
      stage.addComment data
      stage.save (err) ->
        console.log "Failed to save stage after comment", data, err if err

pipe.channels.on 'event:editor-updated', (channelName, socket_id, data) ->
  Stage.findOne channel: channelName, (err, stage) ->
    if err
      console.log "Failed to find Stage", channelName
    else if stage
      pipe.channel(channelName).trigger("editor-updated", data)
      if data.lines
        stage.content = data.lines.join("\n")
      stage.save (err) ->
        console.log "Unable to save stage content update", err if err
  
pipe.channels.on "event:baton-requesting", (channelName, socket_id, data) ->
  Stage.findOne channel: channelName, (err, stage) ->
    if stage
      pipe.channel(channelName).trigger "baton-requested", userId: data.userId

pipe.channels.on "event:baton-giving", (channelName, socket_id, data) ->
  Stage.findOne channel: channelName, (err, stage) ->
    if stage && (stage.batonHolderId + "" == data.oldUserId + "") #auth
      stage.batonHolderId = data.newUserId
      stage.save (err) ->
        if err
          console.log "Error handing baton", err
        else
          pipe.channel(channelName).trigger "baton-given", userId: data.newUserId


module.exports = pipe
