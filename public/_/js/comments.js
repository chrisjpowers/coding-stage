(function(global) {
  var channel = $(document.documentElement).data('pusherchannel'),
      pusher = codingstage.pusher.inst,
      cookies = codingstage.cookies;

  pusher.connection.bind('connected', function() {
    pusher.channel(channel).bind("added-comment", onCommentAdded);
  });

  $(onReady);

  function onReady() {
    $("#text-chat").submit(onFormSubmit);
  }

  function onCommentAdded(comment) {
    var markup = $("<article>", {"class": "attendee"}),
        wrapper = $("<p>", {text: " " + comment.message}),
        username = $("<strong>", {text: comment.author}),
        createdAt = new Date(comment.createdAt),
        time = $("<time>", {text: formatTime(createdAt)});

    username.prepend(time);
    wrapper.prepend(username);
    markup.prepend(wrapper);
    $("#conversation .empty").remove();
    $("#conversation").prepend(markup);
  }

  function onFormSubmit(e) {
    e.preventDefault();
    var field = $("#chat-field"),
        message = field.val(),
        name = cookies.get("name");

    field.val("");
    pusher.channel(channel).trigger("adding-comment", {author: name, message: message});
  }

  function formatTime(date) {
    hour = date.getHours();
    if(hour > 12) hour = hour - 12;
    min = date.getMinutes();
    if(min < 10) min = "0" + min;
    sec = date.getSeconds();
    if(sec < 10) sec = "0" + sec;
    return "(" + hour + ":" + min + ":" + sec + ") ";
  }
})(window);
