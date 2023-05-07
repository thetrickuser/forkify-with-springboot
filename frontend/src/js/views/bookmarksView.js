import previewView from './previewView';
import View from './view';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet! Find a nice recipe and bookmark it';

  _generateMarkup() {
    return this._data
      .map(bookmarks => previewView._generatePreviewMarkup(bookmarks))
      .join('');
  }

  addHandlerBookmark(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
