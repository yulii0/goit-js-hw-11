import Notiflix from 'notiflix';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38172647-004324f73e81c78cef9d04aec';

export async function getApiImages(inpData, pageNumber) {
  const options = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${inpData}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: pageNumber,
    per_page: 40,
  });

  try {
    return await axios.get(`${BASE_URL}?${options}`);
  } catch (error) {
    Notiflix.Report.warning(
      'THE MUSCOVITES BROKE IT ALL',
      'but the Muscovites cannot defeat the Ukrainians. We believe in Ukrainian defenders',
      'Ukraine will win. OK',
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
