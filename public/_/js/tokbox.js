(function(global) {
  var session, enableVideo;

  extend("codingstage.tokbox", {
    init: init
  });
      
  function init(options) {
    session = TB.initSession(options.sessionId);
    enableVideo = $(document.documentElement).data("iscontributor");
    
    session.addEventListener("sessionConnected", sessionConnectedHandler);
    session.addEventListener("streamCreated", streamCreatedHandler);
    session.connect(options.key, options.token);
  }

  function sessionConnectedHandler(event) {
               subscribeToStreams(event.streams);
               if(enableVideo) {
                 session.publish("tokbox-team-1-placeholder");
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
                              session.subscribe(stream, "tokbox-team-" + (i + 2) + "-placeholder");
                      }
              }
      }
})(window);
