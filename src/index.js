import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import SearchImagesAPI from './js/api';

const refs = {
    searchForm: document.querySelector('#search-form'),
    btnLoadMore: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
    searchImagesAPI: new SearchImagesAPI(),
    simpleLightBox: new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    })
}
refs.btnLoadMore.classList.add('is-hidden');

refs.searchForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    refs.searchImagesAPI.query = e.currentTarget.elements.searchQuery.value.trim();
    refs.btnLoadMore.classList.add('is-hidden');
    refs.searchImagesAPI.resetPage();
    refs.gallery.innerHTML = '';  
    if (refs.searchImagesAPI.query) {
        refs.searchImagesAPI.fetchImages( )
            .then(data => {                
                if (data.hits.length < 40) {
                    Notify.failure('We are sorry, but you have reached the end of search results.');
                    refs.btnLoadMore.classList.add('is-hidden');
                    renderImages(data);
                    return;
                }
                refs.btnLoadMore.classList.remove('is-hidden');
                renderImages(data);
            })
    }
});
refs.btnLoadMore.addEventListener('click', () => {
    refs.searchImagesAPI.fetchImages().then(data => {
        if (data.hits.length < 40) {             
            Notify.failure('We are sorry, but you have reached the end of search results.');
            refs.btnLoadMore.classList.add('is-hidden');
            renderImages(data);
            return;
        };
        renderImages(data); 
        scroll();
    });
})

function scroll() {
    const { height: formHeight } = refs.searchForm.getBoundingClientRect();
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2 - formHeight * 2,
        behavior: 'smooth'
    });
}

function renderImages(data) {
    const imagesList = data.hits.map(item => `
    <a class="photo-card"href="${item.largeImageURL}">
    <div >
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="pic-card">
        <p class="pic-info">
        <b>Likes</b> <span>${item.likes}</span>
        </p>
        <p class="pic-info">
        <b>Views</b><span>${item.views}</span>
        </p>
        <p class="pic-info">
        <b>Comments</b><span>${item.comments}</span>
        </p>
        <p class="pic-info">
        <b>Downloads</b><span>${item.downloads}</span>
        </p>
    </div>
    </div>
    </a>
    `).join('');
    refs.gallery.insertAdjacentHTML('beforeend', imagesList);
    refs.simpleLightBox.refresh(); 
}