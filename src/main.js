// src/main.js
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
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('#search-form [name="query"]'),
  loadMore: document.querySelector('#load-more'),
};

let query = '';
let page = 1;
let totalHits = 0;

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
    totalHits = data.totalHits;

    if (!totalHits) {
      showError('Sorry, no images match your search query.');
      return;
    }

    createGallery(data.hits);
    showSuccess(`Hooray! We found ${totalHits} images.`);

    if (page * PER_PAGE < totalHits) showLoadMoreButton();
  } catch (err) {
    console.error(err);
    showError('Something went wrong, try again later.');
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
    console.error(err);
    showError('Something went wrong, try again later.');
  } finally {
    hideLoader();
  }
}


