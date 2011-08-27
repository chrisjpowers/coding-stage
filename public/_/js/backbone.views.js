(function backboneViews (global) {
	
	// ACE EDITOR VIEWS //////////////////////////////
	function get (aceInst) {
		return aceInst.getSession();
	}

	var editorView = new Backbone.View.extend({
		'EDITOR_ID': 'ace-editor'
	
		,'events': {
		
		}
		
		,'initialize': function initialize (options) {
			this.buffer = $('.buffer', this.el);
			this.aceEditor = this.initAce(this.EDITOR_ID);
		}
		
		,'initAce': function initAce (elId) {
			var editorInst
				,mode;
				
			editorInst = ace.edit(elId);
			mode = require("ace/mode/javascript").Mode;
			get(editorInst).setMode(new JavaScriptMode());
			return editorInst;
		}
		
		,'bindAce': function bindAce (aceInst, event, handler) {
			get(aceInst).on(event, handler);
		}
		
		,'sendContentsToServer': function sendContentsToServer (aceInst) {
			var contents;
			
			contents = get(aceInst).getValue();
		}
		
		,'overwriteContents': function overwriteContents (aceInst, contents) {
			get(aceInst).setValue(contents);
		}
	});
	////////////////////////////// ACE EDITOR VIEWS  //
	
	
	
	// TOKBOX VIEWS ///////////////////////////////////
	var videoChatSectionView = new Backbone.View.extend({
		
	});
	
	var videoView = new Backbone.View.extend({
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
	});
	/////////////////////////////////// TOKBOX VIEWS //
} (this));