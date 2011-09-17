(function backboneViews (global) {
	
	var $win = $(window)
		,$docEl = $(document.documentElement)
		,CHANNEL_NAME = $docEl.data('pusherchannel')
		
		// Probably doesn't belong here?
		,isContributor = $docEl.data('iscontributor');
	
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
			this.codingLanguage = $docEl.data('editorlanguage');
			this.aceEditor = this.initAce(this.EDITOR_ID);
			this.setLanguage(this.codingLanguage);
			this.userHasBaton = $docEl.data('hasbaton');
			
			this.bindToAceEvent('change', function () {
				self.aceChange();
			});
			
			this.bindCursorChange();
			
			this.model = new this.MODEL_TYPE({
				'view': this
				,'aceEditor': this.aceEditor
				,'channelName': CHANNEL_NAME
				,'userHasBaton': this.userHasBaton
			});
			
			$win.bind('resize', function () {
				self.windowResize();
			});
			
			if (!this.userHasBaton) {
				this.removeEditingPrivileges();
			}
			
			this.aceChange();
		}
		
		,'initAce': function initAce (elId) {
			var editorInst;
				
			editorInst = ace.edit(elId);
			
			return editorInst;
		}
		
		,'setLanguage': function setLanguage (language) {
			var mode
				,requiredFile;
			
			requiredFile = require('ace/mode/' + language.toLowerCase());
			
			if (requiredFile) {
				mode = requiredFile.Mode;
				get(this.aceEditor).setMode(new mode());
			}
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
			if (this.inputBlockerLayer && this.inputBlockerLayer.length > 0) {
				return;
			}
			
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
		
		,'giveUserBaton': function giveUserBaton () {
			this.giveEditingPrivileges();
			this.userHasBaton = true;
			this.model.giveUserBaton();
		}
		
		,'removeUserBaton': function removeUserBaton () {
			this.removeEditingPrivileges();
			this.userHasBaton = false;
			this.model.removeUserBaton();
		}

                ,'selectCurrentLine': function selectCurrentLine () {
                    var i;
                    
                    // Needs to be done twice because of auto-indentation.
                    for (i = 0; i < 2; i++) {
                        this.aceEditor.selection.moveCursorLineStart();
                    }

                    this.aceEditor.selection.selectLineEnd();
                }

                ,'replaceCurrentLineWith': function selectCurrentLine (newText) {
                    this.selectCurrentLine();
                    this.aceEditor.insert(newText);
                }

                ,'replaceLineWith': function replaceCurrentLineWith (lineNumber, newText) {
                    this.aceEditor.gotoLine(lineNumber);
                    this.replaceCurrentLineWith(newText);
                }
	}));
	////////////////////////////// ACE EDITOR VIEWS  //
	
	
	extend('codingstage.views.notification', Backbone.View.extend({
		'el': $('body')
		
		,'events': {
			'click #notification .approve': 'clickApprove'
			,'click #notification .dismiss': 'clickDismiss'
			//,'click #notification .acknowledge': 'clickAcknowledge'
		}
		
		,'initialize': function initialize (option) {
			
		}
		
		,'createNotification': function createNotification (contents) {
			
			if (typeof this.currentNotification === 'undefined') {
				this.currentNotification = $(document.createElement('div'));

				this.currentNotification
					.attr({
						'id': 'notification'
					})
					.html(contents)
					.show()
					.appendTo('body');
					
			} else {
				this.currentNotification.append(contents);
			}
		}
		
		,'destroyNotification': function destroyNotification () {
			this.currentNotification.remove();
			delete this.currentNotification;
		}
		
		,'clickApprove': function clickApprove (ev) {
			var target;
			
			target = $(ev.target);
			ev.preventDefault();
			
			if (target.closest('#approve-collaborators').length > 0) {
				this.addCollaborator();
			} else if (target.closest('#approve-handoff').length > 0) {
				this.passBaton();
			}
			
			this.afterClick(target);
		}
		
		,'clickDismiss': function clickDismiss (ev) {
			var target;
			
			target = $(ev.target);
			ev.preventDefault();
			this.sendDeclineResponse();
			this.afterClick(target);
		}
		
		,'afterClick': function afterClick (target) {
			// This is just terrible.
			
			var parentArticle
				,parentSection;
			
			parentSection = target.closest('section');
			parentSection.remove();
			
			if (this.currentNotification.children().length === 0) {
				this.destroyNotification();
			}
		}
		
		,'sendDeclineResponse': function sendDeclineResponse () {
			
		}
		
		,'passBaton': function passBaton () {
			
		}
		
		,'addCollaborator': function addCollaborator () {
			
		}
	}));

} (this));
