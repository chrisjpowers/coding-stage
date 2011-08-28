module.exports =
  commentTime: (date) ->
    hour = date.getHours()
    hour = hour - 12 if hour > 12
    min = date.getMinutes()
    min = "0" + min if min < 10
    sec = date.getSeconds()
    sec = "0" + sec if sec < 10
    hour + ":" + min + ":" + sec
