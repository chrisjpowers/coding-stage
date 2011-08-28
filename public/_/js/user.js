(function(global) {
  var data;
  function init(data) {
    data = data;
  }

  function getData() {
    return data;
  }

  codingstage.user = {init: init, data: getData};
})(window);
