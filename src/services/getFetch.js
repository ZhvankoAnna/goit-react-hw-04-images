import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '32975717-e5ee65230820405f183c875ea',
    image_type: 'photo',
    orientation: 'horizontal',
  },
});

export const searchImg = (q, page) => {
  return instance.get('/', {
    params: {
      q,
      page,
      per_page: 12,
    },
  });
};

// 'https://pixabay.com/api/?q=cat&page=1&key=32975717-e5ee65230820405f183c875ea&image_type=photo&orientation=horizontal&per_page=12'
