(function(global) {
  var channel = $(document.documentElement).data('pusherchannel'),
      pusher = codingstage.pusher.inst;

  $("#contribute").live("click", function(e) {
    e.preventDefault();
    codingstage.contributors.request();
  });

  extend("codingstage.contributors", {
    request: function() {
      pusher.channel(channel).trigger("contributor-requesting", {userId: codingstage.user.id, name: codingstage.user.name});
    },
    give: function(userId, name) {
      pusher.channel(channel).trigger("contributor-giving", {oldUserId: codingstage.user.id, newUserId: userId, name: name});
    }
  });

  pusher.channel(channel).bind("contributor-requested", function(data) {
    if($(document.documentElement).data("hasbaton")) {
      var html = $("<div id='approve-handoff'>" + data.name + " would like to become a contributor. </div>");
      var approve = $("<a href='#' class='approve'>Yes</a> "); 
      approve.click(function() {
        codingstage.contributors.give(data.userId, data.name);
      });
      var dismiss = $("<a href='#' class='dismiss'>No</a>");
      html.append(approve).append(dismiss);
      codingstage.instance.notification.stage.createNotification(html);
    }
  });

  pusher.channel(channel).bind("contributor-given", function(data) {
    var message;
    if(data.userId + "" == codingstage.user.id + "") {
      $(document.documentElement).data("iscontributor", true); 
      $("#contributor").hide();
      message = "You are now a contributor!";
      var html = "<div>" + message + " <a href='#' class='dismiss'>Close</a></div>";
      codingstage.instance.notification.stage.createNotification(html);
    }
  });

})(window);

