net = require('net')
{exec} = require 'child_process'
TIMEOUT = 60000

console.log ">> #{process.env.USER}"
console.log ">> #{process.cwd()}"

class Remotexec
  @exec: (command, callback) ->
    exec command, (err, stdout, stderr) ->
      callback(err.toString()) if err?
      callback(stdout)
  @escape: (str) ->
    str.replace(/\\n/g, "\\n").replace(/"/g, "\\\"")

  @ruby: (code, callback) ->
    @exec "ruby -e \"#{@escape code}\"", callback
  @js: (code, callback) ->
    @exec "node -e \"#{@escape code}\"", callback
  @python: (code, callback) ->
    @exec "python -c \"#{@escape code}\"", callback
  @coffee: (code, callback) ->
    @exec "coffee -e \"#{@escape code}\"", callback

net.Socket::respond = (msg) ->
  try
    @write msg
  catch e

server = net.createServer (c) ->
  c.on 'data', (data) ->
    req = JSON.parse(data.toString())
    if ['ruby', 'coffee', 'js'].indexOf(req.lang) != -1
      execProcess = Remotexec[req.lang] req.code, (output) ->
        c.write output
      setTimeout(execProcess.kill, TIMEOUT)
    else
      c.write "Language not supported"

server.listen(8124, 'localhost')
