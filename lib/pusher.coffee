Pusher = require "pusher-pipe"
AppConfig = require "../config/app-config"

pipe = Pusher.createClient
  key: AppConfig.pusher.key,
  secret: AppConfig.pusher.secret,
  app_id: AppConfig.pusher.appId,
  debug: true

pipe.connect()

pipe.sockets.on "open", (socket_id) ->
  console.log "Connection! #{socket_id}"

pipe.sockets.on "close", (socket_id) ->
  console.log "Farewell! #{socket_id}"

# Simply relay all channel events back to browser
pipe.channels.on 'event', (eventName, channelName, socket_id, data) ->
  data.fromServer = true
  pipe.channel(channelName).trigger(eventName, data)
  
module.exports = pipe
