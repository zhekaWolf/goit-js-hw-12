// HTTP-запросы к Pixabay (axios + async/await)

import axios from 'axios';

// Сколько карточек на один запрос — по ТЗ 15
export const PER_PAGE = 15;

// ⚠️ ВСТАВЬ СВОЙ КЛЮЧ (оставь как строку):
const API_KEY = '53049514-dee19204cd3e9e15730e86423';

const api = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  },
});

/**
 * Получить изображения по запросу и номеру страницы
 * @param {string} query
 * @param {number} page
 * @returns {Promise<{totalHits:number, hits:Array}>}
 */
export async function getImagesByQuery(query, page = 1) {
  const { data } = await api.get('', { params: { q: query, page } });
  return data;
}
