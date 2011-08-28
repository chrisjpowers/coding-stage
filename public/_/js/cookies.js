(function setupCookies(global) {
  extend("codingstage.cookies", {
    set: function setCookie (name,value,days) {
            var expires = '', date = new Date();
            if (days) {
                    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                    expires = '; expires=' + date.toGMTString();
            }
            document.cookie = name+'='+value+expires+'; path=/';
    },

    get: function readCookie (name) {
            var nameEQ = name + '=',
                    ca = document.cookie.split(';');
            for(var i=0;i < ca.length;i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                            c = c.substring(1, c.length)
                    }
                    if (c.indexOf(nameEQ) == 0) {
                            return c.substring(nameEQ.length, c.length)
                    }
            }
            return null;
    }
  });
})(window);
