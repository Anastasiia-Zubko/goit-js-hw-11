import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";

const API_KEY = '24804985-79f88283d4ce90865503e9118';
const BASE_URL = 'https://pixabay.com/api/';

export default class SearchImagesAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  } 
  async fetchImages() {
    try {
      const getImages = await axios(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
        .then(response => {
          if (this.page === 1 && response.data.totalHits !== 0) {
            Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
          };
          if (response.data.hits.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
          };
        this.incrementPage();
          return response.data;
        });
      return getImages;
    }
    catch (error) {
        Notify.failure(`${error}`)
    }
  }
}