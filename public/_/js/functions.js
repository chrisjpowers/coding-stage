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
    
    $('.jqModal').jqm({
      trigger: 'a[href="/stages/new"]',
      ajax: '@href', 
      target: 'article'
    });
    
  
	});


	$(window).bind("load", function() {
		
		
	
	});
	
})(jQuery);