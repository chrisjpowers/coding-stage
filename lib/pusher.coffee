Pusher = require "pusher-pipe"
AppConfig = require "../config/app-config"
Stage = require "./models/stage"
socketInfo = {}

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
      stage.removeWatcher info.id
      stage.save (err) ->
        console.log "FAILED TO SAVE STAGE", err if err

pipe.channels.on "event:watcher-joining", (channelName, socket_id, data) ->
  socketInfo[socket_id] = channel: channelName, id: data.id
  pipe.channel(channelName).trigger "watcher-joined", name: data.name, id: data.id
  Stage.findOne channel: channelName, (err, stage) ->
    if stage.addWatcher data
      stage.save (err) ->

# Simply relay all channel events back to browser
 pipe.channels.on 'event', (eventName, channelName, socket_id, data) ->
   data.fromServer = true
   pipe.channel(channelName).trigger(eventName, data)
  
module.exports = pipe
