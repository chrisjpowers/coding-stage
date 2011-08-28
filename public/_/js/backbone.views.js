(function backboneViews (global) {
	
	var CHANNEL_NAME = $(document.documentElement).data('pusherchannel');
	
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
			
			get(this.aceEditor).selection.on('changeCursor', function () {
				self.cursorChange();
			});
			
			this.model = new this.MODEL_TYPE({
				'view': this
				,'aceEditor': this.aceEditor
				,'channelName': CHANNEL_NAME
			});
		}
		
		,'initAce': function initAce (elId) {
			var editorInst;
				
			editorInst = ace.edit(elId);
			
			return editorInst;
		}
		
		,'giveEditingPrivileges': function giveEditingPrivileges () {
			this.hasEditingPrivileges = true;
			this.aceEditor.setScrollSpeed(1);
			this.el.find('textarea').removeAttr('disabled');
		}
		
		,'removeEditingPrivileges': function removeEditingPrivileges () {
			this.hasEditingPrivileges = false;
			this.aceEditor.setScrollSpeed(0);	
			
			this.el.find('textarea')
				.attr({
					'disabled': 'disabled'
				});
		}
		
		,'aceChange': function aceChange (ev) {
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
			this.model.set({
				'cursorPosition': this.aceEditor.getCursorPosition()
			});
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
				//this.aceEditor.selection.moveCursorTo(cursorPosition.row, cursorPosition.column);
				//this.aceEditor.centerSelection();
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