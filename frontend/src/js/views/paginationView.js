import View from './view';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _nextButton = this._parentElement.querySelector('.pagination__btn--next');
  _prevButton = this._parentElement.querySelector('.pagination__btn--prev');

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and has extra page
    if (this._data.page === 1 && numPages > 1) {
      return this._generateNextButtonMarkup();
    }

    // Any page
    else if (this._data.page !== 1 && this._data.page < numPages) {
      return (
        this._generatePrevButtonMarkup() + this._generateNextButtonMarkup()
      );
    }

    // Last Page
    else if (numPages > 1 && this._data.page === numPages) {
      return this._generatePrevButtonMarkup();
    }

    // Page 1 and no extra page
    return '';
  }

  _generateNextButtonMarkup() {
    return `<button data-goto="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
    <span>Page ${this._data.page + 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
    </svg>
  </button>`;
  }

  _generatePrevButtonMarkup() {
    return `<button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
    <span>Page ${this._data.page - 1}</span>
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
  </button>`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }
}

export default new PaginationView();
