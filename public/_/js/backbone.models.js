(function backboneModels (global) {
	
	var pusherInst;
	
	pusherInst = codingstage.pusher.inst;
	
	if (!pusherInst) {
		throw 'Pusher is not available!';
	}
	
	extend('codingstage.models.sharedBuffer', Backbone.Model.extend({

		'events': {
			'change': 'change'
		}
		
		,'defaults': {
			'lines': []
		}
		
		/**
		 * Expects, in options:
		 *
		 * @param {ACEEditor} aceEditor
		 * @param {String} channelName
		 * @param {Backbone.View} view
		 */
		,'initialize': function initialize (options) {
			var self;
			
			if (!options.aceEditor || !options.channelName || !options.view) {
				throw 'codingstage.models.sharedBuffer is missing necessary params.';
			}
			
			self = this;
			_.defaults(this, options);
			this.connectToServer();
			
 			this.bindToServerEvent('editor-updated', function (data) {
				self.getDataFromServer(data);
			});
			
			this.sendDataToServer = _.throttle(this.sendDataToServer, 500);
		}
		
		,'change': function change () {
			this.sendDataToServer({
				'lines': this.get('lines')
			});
		}
		
		,'connectToServer': function connectToServer () {
			this.channel = pusherInst.subscribe(this.channelName);
		}
		
		,'disconnectFromServer': function disconnectFromServer () {
			
		}
		
		,'bindToServerEvent': function bindToServerEvent (eventName, handler) {
			pusherInst.back_channel.bind(eventName, handler);
			this.channel.bind(eventName, handler);
		}
		
		,'getDataFromServer': function getDataFromServer (data) {
			// Will need this commented out for the moment.
			//this.view.overwriteContents(this.aceEditor, data['lines'].join(''));
		}
		
		,'sendDataToServer': function sendDataToServer (data) {
			pusherInst.channel(this.channelName).trigger('editor-updated', data);
		}
	}));

} (this));
