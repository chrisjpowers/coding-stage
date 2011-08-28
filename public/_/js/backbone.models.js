(function backboneModels (global) {
	
	var pusherInst;
	
	extend('DEBUG.userHoldsBaton', true);
	
	pusherInst = codingstage.pusher.inst;
	
	if (!pusherInst) {
		throw 'Pusher is not available!';
	}
	
	extend('codingstage.models.sharedBuffer', Backbone.Model.extend({

		'REQUEST_BUFFER_TIME': 500

		,'events': {
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
			this.previousRequestTimestamp = $.now();
			
			if (pusherInst.connection.state === 'connected') {
				this.pusherInit();
			} else {
				pusherInst.connection.bind('connected', function () {
					self.pusherInit();
				});
			}
		}
		
		,'pusherInit': function pusherInit () {
			var self;
			
			self = this;
			this.connectToServer();
			
 			this.bindToServerEvent('editor-updated', function (data) {
				self.getDataFromServer(data);
			});
		}
		
		,'change': function change () {
			if (DEBUG.userHoldsBaton === true) {
				this.createThrottledUpdate();
			}
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
			if (DEBUG.userHoldsBaton !== true) {
				this.view.overwriteContents(this.aceEditor, data['lines'].join('\n'));
			}
		}
		
		,'createThrottledUpdate': function createThrottledUpdate (data) {
			var self
				,now;
			
			self = this;
			now = $.now();
			
			if (now - this.previousRequestTimestamp < this.REQUEST_BUFFER_TIME) {
				clearTimeout(this.queuedUpdate);
				
				this.queuedUpdate = setTimeout(function () {
					self.sendBufferDataToServer();
				}, this.REQUEST_BUFFER_TIME);
				
				return;
			}
			
			this.previousRequestTimestamp = now;
			this.sendBufferDataToServer();
		}
		
		,'sendBufferDataToServer': function sendBufferDataToServer (data) {
			pusherInst.channel(this.channelName).trigger('editor-updated', {
				'lines': this.get('lines')
			});
		}
	}));

} (this));
