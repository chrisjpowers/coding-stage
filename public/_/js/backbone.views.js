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
		
		,'aceChange': function aceChange (ev) {
			var session
				,lines;
			
			session = get(this.aceEditor);
			lines = session.getLines(0, session.getLength());
			
			this.model.set({
				'lines': lines
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
		
		,'overwriteContents': function overwriteContents (aceInst, contents) {
			var oldPosition;
			
			oldPosition = this.aceEditor.getCursorPosition().row;
			get(aceInst).setValue(contents);
			
			// Yes yes, I know.  This is wrong.
			this.aceEditor.gotoLine(oldPosition + 1);
			this.aceEditor.gotoLine(oldPosition + 1);

			//codingstage.instance.ace.userBuffer.aceEditor.setScrollSpeed(0)
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