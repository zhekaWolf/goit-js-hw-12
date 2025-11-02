import axios from 'axios';

export const PER_PAGE = 15; // по ТЗ HW-12

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
 * @param {string} query - поисковый запрос
 * @param {number} page  - номер страницы (1..n)
 * @returns {Promise<{totalHits:number, hits:Array}>}
 */
export async function getImagesByQuery(query, page = 1) {
  const { data } = await api.get('', { params: { q: query, page } });
  return data;
}
