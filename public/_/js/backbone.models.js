(function backboneModels (global) {
	
	var pusherInst;
	
	pusherInst = codingstage.pusher.inst;
	
	if (!pusherInst) {
		throw 'Pusher is not available!';
	}
	
	extend('codingstage.models.sharedBuffer', Backbone.Model.extend({
		
		/**
		 * Expects, in options:
		 *
		 * @param {ACEEditor} aceEditor
		 * @param {String} channelName
		 * @param {Backbone.View} view
		 */
		'initialize': function initialize (options) {
			if (!options.aceEditor || !options.channelName || !options.view) {
				throw 'codingstage.models.sharedBuffer is missing necessary params.';
			}
			
			_.defaults(this, options);
			this.connectToServer();
 			this.bindToServerEvent('editor-updated', this.getDataFromServer);
		}
		
		,'connectToServer': function connectToServer () {
			this.channel = pusherInst.subscribe(this.channelName);
		}
		
		,'disconnectFromServer': function disconnectFromServer () {
			
		}
		
		,'bindToServerEvent': function bindToServerEvent (eventName, handler) {
			pusherInst.back_channel.bind(eventName, handler);
			//pusherInst.channel(this.channelName).bind(eventName, handler);
			this.channel.bind(eventName, function(thing) {
			  alert('A thing was created: ' + thing.name);
			});
		}
		
		,'getDataFromServer': function getDataFromServer (data) {
			alert(data)
			
			data = $.parseJSON(data);
			
			// TODO:  `editorContents` WILL PROBABLY HAVE TO CHANGE
			this.view.overwriteContents(data['editorContents']);
		}
		
		,'sendDataToServer': function sendDataToServer (data) {
			pusherInst.channel(this.channelName).trigger('editor-updated', data);
		}
	}));

} (this));
