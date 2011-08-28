(function(global) {
  var data;
  function init(data) {
    data = data || {};
  }

  function get(key) {
    return data;
  }

  codingstage.user = {init: init, get: get};
})(window);
