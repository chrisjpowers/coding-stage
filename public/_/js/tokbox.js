(function(global) {
  var counter = 0, containerMap = {}, session, enableVideo;

  extend("codingstage.tokbox", {
    init: init
  });
      
  function init(options) {
    session = TB.initSession(options.sessionId);
    enableVideo = $(document.documentElement).data("iscontributor");
    
    session.addEventListener("sessionConnected", sessionConnectedHandler);
    session.addEventListener("streamCreated", streamCreatedHandler);
    session.addEventListener("streamDestroyed", streamDestroyedHandler);
    session.connect(options.key, options.token);
  }

  function sessionConnectedHandler(event) {
               subscribeToStreams(event.streams);
               if(enableVideo) {
                 session.publish(getContainerId());
               }
      }
      
      function streamCreatedHandler(event) {
              subscribeToStreams(event.streams);
      }
      
      function subscribeToStreams(streams) {
              for (i = 0; i < streams.length; i++) {
                      var stream = streams[i];
                      if (stream.connection.connectionId != session.connection.connectionId) {
                        console.log("stream", stream);
                              session.subscribe(stream, getContainerId());
                      }
              }
      }

      function streamDestroyedHandler(event) {
        setTimeout(function() {
          $("#video-chat article").each(function() {
            var article = $(this);
            if(!article.children()[0]) { article.remove(); }
          });
        }, 1000);
      }

      function getContainerId() {
        var id = "tokbox-" + counter;
        var article = $("<article>");
        var div = $("<div>", {"class": "tokbox", "id": id});
        article.append(div);
        $("#video-chat").append(article);
        counter += 1;
        return id;
      }
})(window);
