import previewView from './previewView';
import View from './view';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';

  _generateMarkup() {
    return this._data
      .map(result => previewView._generatePreviewMarkup(result))
      .join('');
  }
}

export default new ResultsView();
