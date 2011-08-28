(function setupWatchers(global) {
  var channel = $(document.documentElement).data('pusherchannel'),
      pusher = codingstage.pusher.inst,
      cookies = codingstage.cookies;

  pusher.subscribe(channel);
  pusher.connection.bind('connected', function() {
    setupListeners();
  });
      
  function setupListeners() {
    pusher.channel(channel).bind("watcher-joined", onWatcherJoined);
    pusher.channel(channel).bind("watcher-left", onWatcherLeft);

    if(codingstage.user.name) {
      cookies.set("name", codingstage.user.name, 30);
    }

    var name = cookies.get("name"),
        watcherId = cookies.get("watcherId");
    if(!name) { 
      name = global.prompt("What is your name?");
      cookies.set("name", name, 30);
    }
    if(!watcherId) {
      watcherId = Math.floor(Math.random() * 1000000000);
    }
    pusher.channel(channel).trigger("watcher-joining", {id: watcherId, name: name});
  }

  function onWatcherJoined(data) {
    var li = $("<li>", {"class": "attendee", "text": data.name, "id": "watcher-" + data.id});
    $("#attendees ol").append(li);
    //incrementCount();
  }

  function onWatcherLeft(data) {
    $("watcher-" + data.id).remove();
    //decrementCount();
  }

  function incrementCount() {
    changeCount($("#watchers-count"), 1);
  }

  function decrementCount() {
    changeCount($("#watchers-count"), -1);
  }

  function changeCount(el, change) {
    var currentVal = parseInt(el.text());
    el.text(currentVal + change);
  }
})(window);
