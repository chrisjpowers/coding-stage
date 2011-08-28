(function(global) {
  var channel = $(document.documentElement).data('pusherchannel'),
      pusher = codingstage.pusher.inst;

  extend("codingstage.baton", {
    request: function() {
      pusher.channel(channel).trigger("baton-requesting", {userId: codingstage.user.id});
    },
    give: function(userId) {
      pusher.channel(channel).trigger("baton-giving", {oldUserId: codingstage.user.id, newUserId: userId});
    }
  });

  pusher.channel(channel).bind("baton-requested", function(data) {
    if($(document.documentElement).data("hasbaton")) {
      console.log("User with id " + data.userId + " and socket " + data.socket + " wants the baton.");
    }
  });

  pusher.channel(channel).bind("baton-given", function(data) {
    if(data.userId + "" == codingstage.user.id + "") {
      $(document.documentElement).data("hasbaton", true);
      codingstage.instance.ace.userBuffer.giveEditingPrivileges();
      console.log("You got the baton!");
    } else {
      $(document.documentElement).data("hasbaton", false);
      codingstage.instance.ace.userBuffer.removeEditingPrivileges();
      console.log("No baton for you.");
    }
  });
})(window);
