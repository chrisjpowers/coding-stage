jQuery(function () {
  jQuery("#run-code").click(function (e) {
    e.preventDefault();
    code = codingstage.instance.ace.userBuffer.aceEditor.getSession().getValue()
    $.post("/run", {lang:"ruby", code: code}, function (output) {
      alert(output);
    });
  });
});

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
			,'cursorPosition': {}
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
			this.hasReceivedBufferData = false;
			
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
				if (typeof data['lines'] !== 'undefined') {
					this.hasReceivedBufferData = true;
					this.view.overwriteContents(this.aceEditor, data['lines'].join('\n'), data['cursorPosition']);
				} else {
					this.view.updateCursorPosition(data['cursorPosition']);
				}
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
					self.sendDataToServer();
				}, this.REQUEST_BUFFER_TIME);
				
				return;
			}
			
			this.previousRequestTimestamp = now;
			this.sendDataToServer();
		}
		
		,'sendDataToServer': function sendDataToServer () {
			var updateMethod;
			
			if (this.get('lines') === this.previouslySentLines) {
				updateMethod = this.sendCursorDataToServer;
			} else {
				updateMethod = this.sendBufferDataToServer;
			}
			
			updateMethod.call(this);
		}
		
		,'sendBufferDataToServer': function sendBufferDataToServer () {
			this.previouslySentLines = this.get('lines');
			
			pusherInst.channel(this.channelName).trigger('editor-updated', {
				'lines': this.get('lines')
				,'cursorPosition': this.get('cursorPosition')
			});
		}
		
		,'sendCursorDataToServer': function sendCursorDataToServer () {
			pusherInst.channel(this.channelName).trigger('editor-updated', {
				'cursorPosition': this.get('cursorPosition')
			});
		}
	}));

} (this));
