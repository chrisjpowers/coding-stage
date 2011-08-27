{exec, spawn} = require 'child_process'
output = (data) -> console.log data.toString()

task "run", (option) ->
  exec 'npm install .', (err, stdout) ->
    throw err if err?
    console.log stdout

    deploy = spawn 'node', ['server.js']
    deploy.stdout.on 'data', output
    deploy.stderr.on 'data', output
    deploy.on 'exit', ->

task "deploy", (option) ->
  deploy = spawn './scripts/deploy', ['linode']
  deploy.stdout.on 'data', output
  deploy.stderr.on 'data', output
  deploy.on 'exit', ->

task "deploy:setup", (option) ->
  deploy = spawn './scripts/deploy', ['linode', 'setup']
  deploy.stdout.on 'data', output
  deploy.stderr.on 'data', output
  deploy.on 'exit', ->

task "logs", (option) ->
  exec 'ssh deploy@nko "cat app/shared/logs/node.log"', (err, stdout) ->
    throw err if err?
    console.log stdout

task "logs:tail", (option) ->
  cmd = '"ls -l"'
  tail = spawn './scripts/tail-logs'
  tail.stdout.on 'data', output
  tail.stderr.on 'data', output
  tail.on 'exit', ->
