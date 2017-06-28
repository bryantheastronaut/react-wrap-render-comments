'use babel';

import ReactWrapRenderCommentsView from './react-wrap-render-comments-view';
import { CompositeDisposable } from 'atom';

export default {

  reactWrapRenderCommentsView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.reactWrapRenderCommentsView = new ReactWrapRenderCommentsView(state.reactWrapRenderCommentsViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.reactWrapRenderCommentsView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'react-wrap-render-comments:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.reactWrapRenderCommentsView.destroy();
  },

  serialize() {
    return {
      reactWrapRenderCommentsViewState: this.reactWrapRenderCommentsView.serialize()
    };
  },

  toggle() {
		let editor;
		if (editor = atom.workspace.getActiveTextEditor()) {
			const selection = editor.getSelectedText();
			let changedSelection;
			if (selection.match('{/*')) {
				changedSelection = selection.replace('{/*', '').replace('*/}', '');
			} else {
				changedSelection = `{/*${selection}*/}`;
			}
			editor.insertText(changedSelection);
		}
  }

};
