$(function () {
	var editor;
	
	extend('DEBUG.notificationTest', false);
	
	editor = $('#editor');
	
	if (editor.length > 0) {
		extend('codingstage.instance.ace.userBuffer', new codingstage.views.editor({
			'el': $('#editor')
		}));
	}
	
	extend('codingstage.instance.notification.stage', new codingstage.views.notification());
	
	if (DEBUG.notificationTest === true) {
		var tempInternals = $('#notification').html();
		$('#notification').remove();
		
		codingstage.instance.notification.stage.createNotification(tempInternals);
	}
	
});
