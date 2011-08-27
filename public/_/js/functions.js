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
		$('#room-settings legend').click(function() {
		  $(this).parent().children().not(this).slideToggle(100);
		  $(this).toggleClass('open')
		});

	});


	$(window).bind("load", function() {
		
		
	
	});
	
})(jQuery);