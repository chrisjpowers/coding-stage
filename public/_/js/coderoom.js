$(function () {
	var editor;
	
	editor = $('#editor');
	
	if (editor.length > 0) {
		extend('codingstage.instance.ace.userBuffer', new codingstage.views.editor({
			'el': $('#editor')
		}));
	}
});
