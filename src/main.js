// src/js/main.js
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

// Глобальний стан
let query = '';
let page = 1;
let totalHits = 0;

// Початково кнопка прихована
hideLoadMoreButton();

// Події
refs.form.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore);

// ===== helpers to control Load More button =====
function showLoadMoreButton() {
  refs.loadMore.hidden = false;
}
function hideLoadMoreButton() {
  refs.loadMore.hidden = true;
}

// ===== Handlers =====
async function onSearch(e) {
  e.preventDefault();

  query = refs.input.value.trim();
  if (!query) {
    showInfo('Enter a search term');
    return;
  }

  // Скидаємо стан для нового пошуку
  page = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton(); // кнопка схована до отримання результатів

  showLoader();
  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits ?? 0;

    if (!totalHits) {
      showError('Sorry, no images match your search query.');
      return;
    }

    // Малюємо першу сторінку
    createGallery(data.hits);
    showSuccess(`Hooray! We found ${totalHits} images.`);

    // Якщо є ще сторінки — показуємо кнопку; інакше — повідомляємо про кінець
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

  hideLoadMoreButton(); // ховаємо на час запиту
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // Якщо дійшли до кінця — повідомляємо; інакше повертаємо кнопку
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


