import './styles/styles.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';

import { getApiImages } from './JS/api';

import { getMarkUpAllImages } from './JS/markupgallery';

let pageNumber = 1;
let perPageNumberGroup = 1;
let inpData = '';
const perPage = 40;

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '150',
});

const refs = {
  form: document.querySelector('#search-form'),
  formBtnSubmit: document.querySelector('[type=submit]'),
  formInput: document.querySelector('#search-form input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.loadMoreBtn.classList.add('is-hidden');
refs.formBtnSubmit.disabled = true;
refs.gallery.innerHTML = '';
refs.formBtnSubmit.style.cssText = `
  background-color: rgba(239, 239, 239, 0.3); 
  font-size: large; 
  color: rgba(16, 16, 16, 0.3), rgba(255, 255, 255, 0.3); 
  padding: 12px 20px; 
  border: 2px solid rgba(118, 118, 118, 0.3), rgba(195, 195, 195, 0.3); 
  border-radius: 8px; width: 128px; 
  box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
`;

refs.formInput.addEventListener('input', onSearchFormInput);

refs.form.addEventListener('submit', onFormBtnSubmitClick);

refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSearchFormInput(event) {
  if (!event.target.value.trim()) {
    return (refs.formBtnSubmit.disabled = true);
  } else if (event.target.value.trim().length > 0) {
    return (
      (refs.formBtnSubmit.disabled = false),
      (refs.formBtnSubmit.style.cssText = `
        background-color: #08aa31c2; 
        font-size: large; 
        color: #f6c218; 
        padding: 12px 20px; 
        border: 2px solid #f6c218; 
        border-radius: 8px; 
        cursor: pointer; 
        width: 128px; 
        box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px; 
      `)
    );
  }
}

async function onFormBtnSubmitClick(event) {
  event.preventDefault();

  refs.gallery.innerHTML = '';

  inpData = refs.formInput.value.trim();

  const response = await getApiImages(inpData);

  try {
    const { hits, totalHits } = response.data;

    perPageNumberGroup = Math.ceil(totalHits / perPage);

    refs.loadMoreBtn.classList.remove('is-hidden');
    refs.loadMoreBtn.style.cssText = `
      background-color: #08aa31c2; 
      font-size: large; 
      color: #f6c218; 
      padding: 12px 20px; 
      border: 2px solid #f6c218; 
      border-radius: 8px; 
      cursor: pointer; 
      width: 136px; 
      margin-bottom: 32px;
      box-shadow: rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px; 
    `;

    if (totalHits === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');

      refs.gallery.innerHTML = '';

      return Notiflix.Notify.failure(
        'Sorry. We assume, that all the pictures at your request were stolen by someone.'
      );
    } else if (perPageNumberGroup === pageNumber) {
      refs.loadMoreBtn.classList.add('is-hidden');

      refs.gallery.innerHTML = '';

      Notiflix.Notify.success(`We found  ${totalHits} images.`);

      refs.gallery.insertAdjacentHTML('beforeend', getMarkUpAllImages(hits));

      lightbox.refresh();

      return Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }

    refs.gallery.insertAdjacentHTML('beforeend', getMarkUpAllImages(hits));

    lightbox.refresh();

    return Notiflix.Notify.success(`We found  ${totalHits} images.`);
  } catch (error) {
    return Notiflix.Report.warning(
      `Error is ${error.message}`,
      'Dont worry, try reload the page',
      {
        width: '320px',
        svgSize: '30px',
        messageFontSize: '16px',
        backgroundColor: '0xFFFFFF',
        warning: {
          svgColor: '#f6c218',
          titleColor: '#f6c218',
          messageColor: '#f6c218',
          buttonBackground: '#08aa31c2',
          buttonColor: '#f6c218',
          backOverlayColor: 'rgba(238,191,49,0.9)',
        },
      }
    );
  }
}

async function onLoadMoreBtnClick() {
  pageNumber += 1;
  try {
    const response = await getApiImages(inpData, pageNumber, perPage);
    const { hits } = response.data;
    refs.gallery.insertAdjacentHTML('beforeend', getMarkUpAllImages(hits));

    lightbox.refresh();

    if (perPageNumberGroup === pageNumber) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  } catch (error) {
    return Notiflix.Report.warning(
      `THE MUSCOVITES BROKE IT ALL, Error is ${error.message}`,
      'Dont worry, Ukrainians will correct these mistakes',
      'OK',
      {
        width: '320px',
        svgSize: '30px',
        messageFontSize: '16px',
        backgroundColor: '#e42525cd',
        warning: {
          svgColor: '#f6c218',
          titleColor: '#f6c218',
          messageColor: '#f6c218',
          buttonBackground: '#08aa31c2',
          buttonColor: '#f6c218',
          backOverlayColor: 'rgba(238,191,49,0.9)',
        },
      }
    );
  }
}
