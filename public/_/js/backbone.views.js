(function backboneViews (global) {
	
	var CHANNEL_NAME = $(document.documentElement).data('pusherchannel')
		$win = $(window);
	
	// ACE EDITOR VIEWS //////////////////////////////
	function get (aceInst) {
		return aceInst.getSession();
	}

	extend('codingstage.views.editor', Backbone.View.extend({
		'EDITOR_ID': 'ace-editor'
		
		,'MODEL_TYPE': codingstage.models.sharedBuffer
	
		,'events': {
		
		}
		
		,'initialize': function initialize (options) {
			var self = this;
			
			this.buffer = $('.buffer', this.el);
			this.aceEditor = this.initAce(this.EDITOR_ID);
			
			this.bindToAceEvent('change', function () {
				self.aceChange();
			});
			
			this.bindCursorChange();
			
			this.model = new this.MODEL_TYPE({
				'view': this
				,'aceEditor': this.aceEditor
				,'channelName': CHANNEL_NAME
			});
			
			$win.bind('resize', function () {
				self.windowResize();
			});
		}
		
		,'initAce': function initAce (elId) {
			var editorInst;
				
			editorInst = ace.edit(elId);
			
			return editorInst;
		}
		
		,'bindCursorChange': function bindCursorChange () {
			self = this;
			
			get(this.aceEditor).selection.addEventListener('changeCursor', function () {
				self.cursorChange();
			});
		}
		
		,'giveEditingPrivileges': function giveEditingPrivileges () {
			this.hasEditingPrivileges = true;
			this.aceEditor.setScrollSpeed(1);
			this.el.find('textarea').removeAttr('disabled');
			
			if (this.inputBlockerLayer) {
				this.inputBlockerLayer.remove();
			}
		}
		
		,'removeEditingPrivileges': function removeEditingPrivileges () {
			this.hasEditingPrivileges = false;
			this.aceEditor.setScrollSpeed(0);	
			
			this.el.find('textarea')
				.attr({
					'disabled': 'disabled'
				});
				
			this.inputBlockerLayer = $(document.createElement('div'), {
				'class': "blocker-layer"
			}).css({
				'position': 'absolute'
				,'top': 0
				,'left': 0
				,'z-index': 1000
			});
			
			this.el.append(this.inputBlockerLayer);
			this.updateInputBlocker();
		}
		
		,'aceChange': function aceChange () {
			var session
				,lines;
			
			session = get(this.aceEditor);
			lines = session.getLines(0, session.getLength());
			
			this.model.set({
				'lines': lines
				,'cursorPosition': this.aceEditor.getCursorPosition()
			});
		}
		
		,'cursorChange': function cursorChange () {
			var modelCursorPosition
				,uiCursorPosition;
			
			//modelCursorPosition = this.model.get('cursorPosition');
			uiCursorPosition = this.aceEditor.getCursorPosition();
			
			//if (this.hasEditingPrivileges === true) {
				this.model.set({
					'cursorPosition': uiCursorPosition
				});
			//} else {
			//	if (modelCursorPosition.column !== uiCursorPosition.column
			//		||modelCursorPosition.row !== uiCursorPosition.row) {
			//		//this.updateCursorPosition(modelCursorPosition);
			//	}
			//}
		}
		
		,'windowResize': function windowResize (ev) {
			this.updateInputBlocker();
		}
		
		,'updateInputBlocker': function updateInputBlocker () {
			if (this.inputBlockerLayer) {
				this.inputBlockerLayer
					.css({
						'height': this.el.height()
						,'width': this.el.width()
					}).position({
						'my': 'left top'
						,'at': 'left top'
						,'of': this.el.find('#' + this.EDITOR_ID)
						,'collision': 'none'
					});
			}
		}
		
		,'bindAce': function bindAce (aceInst, event, handler) {
			get(aceInst).on(event, handler);
		}
		
		,'bindToAceEvent': function bindToAceEvent (eventName, handler) {
			get(this.aceEditor).on(eventName, handler);
		}
		
		,'sendContentsToServer': function sendContentsToServer (aceInst) {
			var contents;
			
			contents = get(aceInst).getValue();
		}
		
		,'updateCursorPosition': function updateCursorPosition (cursorPosition) {
			this.aceEditor.selection.moveCursorTo(cursorPosition.row, cursorPosition.column);
			this.aceEditor.centerSelection();
		}
		
		,'overwriteContents': function overwriteContents (aceInst, contents, cursorPosition) {
			var session
				,oldPosition
				,currentCursorPosition;
			
			session = get(aceInst);
			currentCursorPosition = this.aceEditor.getCursorPosition()
			
			if (contents !== session.getValue()
				|| currentCursorPosition.column !== cursorPosition.column
				|| currentCursorPosition.row !== cursorPosition.row) {
					
				session.setValue(contents);
				this.updateCursorPosition(cursorPosition);
			}
		}
	}));
	////////////////////////////// ACE EDITOR VIEWS  //
	
	
	
	// TOKBOX VIEWS ///////////////////////////////////
	extend('codingstage.views.videoChatSection', new Backbone.View.extend({
		
	}));
	
	extend('codingstage.views.video', new Backbone.View.extend({
		'events': {
		
		}
		
		/*
		var apiKey = '1127';
		    var sessionId = '14685d1ac5907f4a2814fed28294d3f797f34955';
		    var token = 'devtoken';
		*/
		
		/**
		 * Expects, in `options`:
		 * 
		 * @param {String} id The id that the TokBox instance should live in.
		 * @param {String} apiKey
		 * @param {String} sessionId
		 * @param {String} token
		 */
		,'initialize': function initialize (options) {
			if (!options.id || !options.apiKey || !options.sessionId || !options.token) {
				throw 'Missing necessary Tokbox info.';
			}
			
			this._options = _.extend({}, options);
		}
	}));
	/////////////////////////////////// TOKBOX VIEWS //
} (this));