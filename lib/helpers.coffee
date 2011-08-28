_ = require "underscore"

module.exports =
  commentTime: (date) ->
    hour = date.getHours()
    hour = hour - 12 if hour > 12
    min = date.getMinutes()
    min = "0" + min if min < 10
    sec = date.getSeconds()
    sec = "0" + sec if sec < 10
    hour + ":" + min + ":" + sec

  isContributor: (contributors, everyauth) ->
    return false unless everyauth.loggedIn
    !!(_.detect contributors, (user) -> 
      console.log "Comparing", user.github.email, everyauth.user.github.email
      user.github.email == everyauth.user.github.email
    )
