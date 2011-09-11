/* Declare a namespace for the site */
var Site = window.Site || {};

/* Create a closure to maintain scope of the '$'
   and remain compatible with other frameworks.  */
(function($) {
	
	//same as $(document).ready();
	$(function() {
		
		// Placeholder support for non-HTML5 supporting browsers
		$('input, textarea').placeholder();
		
		// Hide/show Room Settings
		$('#stage-settings legend').click(function() {
		  var mq = $(window).width();
		  if(mq >= 768) {
  		  $(this).parent().children().not(this).slideToggle(100);
  		  $(this).toggleClass('open')
		  }
		});
		
		// Modal Boxes
    
        $('#create-room').jqm({
          trigger: 'a[href="/stages/new"]',
          overlay: 75,
          closeClass: 'close'
        });
    
	});

	/**
	 * Computes a numerical signature of a string.  It just sums up the charCodes of all the characters of the input string.
	 * @param{String} ofString  The string to calculate.
	 */
	extend('codingstage.util.getSpeedySignature', function getSpeedySignature (ofString) {
		var sum
			,len
			,i;

		sum = 0;
		len = ofString.length;

		for (i = 0; i < len; i++) {
			sum += ofString.charCodeAt(i);
		}

		return sum;
	});

	$(window).bind("load", function() {
		
		
	
	});
	
})(jQuery);