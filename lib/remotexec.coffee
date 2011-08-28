net = require('net')

remotexec = (args) ->
  throw "remoteexec needs lang and code" unless args.lang? && args.code? || args.json?
  timeout = args.timeout || 1000
  serverPort = args.serverPort || 8124

  try
    socket = net.createConnection serverPort
    setTimeout((->
      args.timeout?()
      socket.destroy()
    ), timeout)

    socket.on 'connect', ->
      if args.json?
        socket.write args.json
      else
        socket.write JSON.stringify
          lang: args.lang
          code: args.code

      socket.on 'data', (data) ->
        socket.destroy()
        args.callback?(data.toString())

    socket.on 'error', ->
      args.error?()
  catch e
    args.error?()

#remoteexec
  #lang: "ruby"
  #code: '''
    #a = "ben"
    #puts "#{a} mills"
  #'''
  #timeout: ->
    #console.log("timeout")
  #callback: (output) ->
    #console.log output

module.exports = remotexec
