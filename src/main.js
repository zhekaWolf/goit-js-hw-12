// main.js  (файл лежит в src/)

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showInfo,
  showSuccess,
  showError,
  smoothScrollAfterAppend,
} from './js/render-functions.js';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-form [name="query"]'),
  gallery: document.querySelector('#gallery'),
  loadMore: document.querySelector('#load-more'),
};

// helpers to show/hide the Load More button (class-based)
function showLoadMoreButton() {
  refs.loadMore.classList.remove('hidden');
}
function hideLoadMoreButton() {
  refs.loadMore.classList.add('hidden');
}

let query = '';
let page = 1;
let totalHits = 0;

// прячем Load More при загрузке страницы
hideLoadMoreButton();

refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = refs.input.value.trim();
  if (!query) {
    showInfo('Enter a search term');
    return;
  }

  page = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();

  showLoader();
  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits ?? 0;

    if (!totalHits) {
      showError('Sorry, no images match your search query.');
      return;
    }

    createGallery(data.hits);
    showSuccess(`Hooray! We found ${totalHits} images.`);

    // первая страница: либо показываем Load More, либо сразу говорим что это конец
    if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      showInfo("We're sorry, but you've reached the end of search results.");
    }
  } catch (err) {
    showError(err.message || 'Something went wrong, try again later.');
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    if (page * PER_PAGE >= totalHits) {
      showInfo("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMoreButton();
    }

    smoothScrollAfterAppend();
  } catch (err) {
    showError(err.message || 'Something went wrong, try again later.');
  } finally {
    hideLoader();
  }
}


