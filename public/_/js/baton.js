(function(global) {
  var channel = $(document.documentElement).data('pusherchannel'),
      pusher = codingstage.pusher.inst;

  $(function() {
    $("#control").live("click", function(e) {
      e.preventDefault();
      codingstage.baton.request();
    });

    if($(document.documentElement).data("hasbaton")) {
      $("#control").hide();
    }
  });

  extend("codingstage.baton", {
    request: function() {
      pusher.channel(channel).trigger("baton-requesting", {userId: codingstage.user.id, name: codingstage.user.name});
    },
    give: function(userId, name) {
      pusher.channel(channel).trigger("baton-giving", {oldUserId: codingstage.user.id, newUserId: userId, name: name});
    }
  });

  pusher.channel(channel).bind("baton-requested", function(data) {
    if($(document.documentElement).data("hasbaton")) {
      var html = $("<section id='approve-handoff'>" + data.name + " would like to take the stage. </section>");
      var approve = $("<a href='#' class='approve'>Yes</a> "); 
      approve.click(function() {
        codingstage.baton.give(data.userId, data.name);
      });
      var dismiss = $("<a href='#' id='close' class='dismiss'>No</a>");
      html.append(approve).append(dismiss);
      codingstage.instance.notification.stage.createNotification(html);
    }
  });

  pusher.channel(channel).bind("baton-given", function(data) {
    var message;

    if(data.userId + "" == codingstage.user.id + "") {
      codingstage.instance.ace.userBuffer.giveUserBaton()
      $(document.documentElement).data("hasbaton", true); 
      message = "You have taken the stage!"
      $("#control").hide();
    } else {
      codingstage.instance.ace.userBuffer.giveEditingPrivileges();
      $(document.documentElement).data("hasbaton", false);
      message = data.name + " has taken the stage!";
      $("#control").show();
    }
    var html = "<section>" + message + " <a href='#' class='dismiss'>Close</a></section>";
    codingstage.instance.notification.stage.createNotification(html);
  });
})(window);
