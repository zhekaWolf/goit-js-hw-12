// Рендер, модалка, лоадер, тосты, кнопка Load more

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const gallery = document.querySelector('#gallery');
const loader  = document.querySelector('#loader');      // элемент-лоадер
const btnMore = document.querySelector('#load-more');   // кнопка "Load more"

// Однажды создаём lightbox для ссылок внутри .gallery
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images.map(cardTpl).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  // Добавляем класс показа и убираем hidden (на случай, если он использовался)
  loader.classList.add('is-visible');
  loader.hidden = false;
}
export function hideLoader() {
  loader.classList.remove('is-visible');
  loader.hidden = true;
}

export function showLoadMoreButton() {
  btnMore.classList.add('is-visible');
  btnMore.hidden = false;
}
export function hideLoadMoreButton() {
  btnMore.classList.remove('is-visible');
  btnMore.hidden = true;
}

export function showInfo(message) {
  iziToast.info({ message, position: 'topRight' });
}
export function showSuccess(message) {
  iziToast.success({ message, position: 'topRight' });
}
export function showError(message) {
  iziToast.error({ message, position: 'topRight' });
}

export function smoothScrollAfterAppend() {
  const first = gallery.firstElementChild;
  if (!first) return;
  const { height } = first.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}

function cardTpl({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
  return `
<li class="photo-card">
  <a class="gallery__link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${escapeHtml(tags)}" loading="lazy" />
  </a>
  <div class="info">
    <p><b>Likes</b> ${likes}</p>
    <p><b>Views</b> ${views}</p>
    <p><b>Comments</b> ${comments}</p>
    <p><b>Downloads</b> ${downloads}</p>
  </div>
</li>`;
}

// маленькая защита alt от спецсимволов
function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
