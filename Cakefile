{exec, spawn} = require 'child_process'
output = (data) -> console.log data.toString()

task "deploy", (option) ->
  deploy = spawn './deploy', ['linode']
  deploy.stdout.on 'data', output
  deploy.stderr.on 'data', output
  deploy.on 'exit', ->

task "deploy:setup", (option) ->
  deploy = spawn './deploy', ['linode', 'setup']
  deploy.stdout.on 'data', output
  deploy.stderr.on 'data', output
  deploy.on 'exit', ->

task "setup", (option) ->
  console.log "Setting up app"
