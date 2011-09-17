jQuery(function () {
  
  var lang = jQuery(document.documentElement).data('editorlanguage');
  var run = jQuery("#run-code");

  if (['JavaScript', 'Ruby', 'CoffeeScript'].indexOf(lang) < 0) {
    run.hide()
  } else {
    run.click(function (e) {
      e.preventDefault();
      var code = codingstage.instance.ace.userBuffer.aceEditor.getSession().getValue()

      if (lang === "JavaScript") lang = "js"
      if (lang === "Ruby") lang = "ruby"
      if (lang === "CoffeeScript") lang = "coffee"
    
      jQuery.post("/run", {lang: lang, code: code}, function (output) {
        alert(output);
      });
    });
  }

  var stagePicker = jQuery("#filter.stagePicker select");
  var allStages = jQuery("section.all");
  var myStages = jQuery("section.mine");

  allStages.show();
  myStages.hide();

  stagePicker.change(function (e) {
    if (this.value === "all") {
      allStages.show();
      myStages.hide();
    } else {
      allStages.hide();
      myStages.show();
    }
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
		 * @param {Boolean} userHasBaton
		 */
		,'initialize': function initialize (options) {
			
			var self;
			
			if (!options.aceEditor || !options.channelName || !options.view || typeof options.userHasBaton === 'undefined') {
				throw 'codingstage.models.sharedBuffer is missing necessary params.';
			}
			
			self = this;
			_.defaults(this, options);
			this.previousRequestTimestamp = $.now();
			this.hasReceivedBufferData = false;
                        this.previouslySentLines = [];
                        this.previouslyReceivedLines = [];
			
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
			if (this.userHasBaton === true) {
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
			if (this.userHasBaton === false) {
				if (typeof data['lines'] !== 'undefined') {
                                        this.previouslyReceivedLines = data['lines'].join('\n');
					this.hasReceivedBufferData = true;
					this.view.overwriteContents(this.aceEditor, this.previouslyReceivedLines, data['cursorPosition']);
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
                        if (this.previouslySentLines) {
                            this.getWhatChanged();
                        }

			this.previouslySentLines = this.get('lines');

			pusherInst.channel(this.channelName).trigger('editor-updated', {
				'lines': this.previouslySentLines
				,'cursorPosition': this.get('cursorPosition')
			});
		}
		
		,'sendCursorDataToServer': function sendCursorDataToServer () {
			pusherInst.channel(this.channelName).trigger('editor-updated', {
				'cursorPosition': this.get('cursorPosition')
			});
		}
		
		,'giveUserBaton': function giveUserBaton () {
			this.userHasBaton = true;
		}
		
		,'removeUserBaton': function removeUserBaton () {
			this.userHasBaton = false;
		}

                ,'getWhatChanged': function getWhatChanged () {
                        var startPointOfModification
                            ,currentLines
                            ,previousLines // Ok, this is dumb.  Shouldn't be converting the lines back and forth from a String to an Array.
                            ,endPointOfModification
                            ,len, i;

                        previousLines = this.previouslySentLines; 
                        currentLines = this.get('lines');

                        len = Math.min(currentLines.length, this.previouslySentLines.length);

                        for (i = 0; i < len; i++) {
                            if (previousLines[i] !== currentLines[i]) {
                                startPointOfModification = i;
                                break;
                            }
                        }

                        //console.log(startPointOfModification);
                }
	}));

} (this));
