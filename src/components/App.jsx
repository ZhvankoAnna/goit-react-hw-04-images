import { useState, useEffect } from 'react';
import { searchImg } from 'services/getFetch';
import Searchbar from './Searchbar/Searchbar';
import Spinner from 'shared/components/Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from '../shared/components/Button/Button';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '../shared/components/Modal/Modal';
import css from './app.module.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageProps, setImageProps] = useState({});

  useEffect(() => {
    const getFetch = async () => {
      try {
        const { data } = await searchImg(search, page);
        setImages(prevImages => [...prevImages, ...data.hits]);
        setTotal(data.total);
        setStatus('resolved');
      } catch ({ error }) {
        const errorMessage = error.data.message || 'Cannot fetch images.';
        setError(errorMessage);
        setStatus('rejected');
      }
    };

    if (search) {
      setStatus('pending');
      getFetch();
    }
  }, [search, page]);

  const getFormData = data => {
    if (search !== data) {
      setSearch(data);
      setImages([]);
      setPage(1);
      setTotal(null);
    }
  };

  const handleLoadMoreClick = () => setPage(prevPage => prevPage + 1);

  const notifyError = message => {
    toast.error(message);
  };

  const onShowModal = ({ largeImageURL, tags }) => {
    setShowModal(true);
    setImageProps({
      largeImageURL,
      tags,
    });
  };

  const onCloseModal = () => {
    setShowModal(false);
    setImageProps({});
  };

  return (
    <div className={css.app}>
      {showModal && (
        <Modal onClose={onCloseModal}>
          <img src={imageProps.largeImageURL} alt={imageProps.tags} />
        </Modal>
      )}
      <Searchbar onSubmit={getFormData} />
      {status === 'pending' && <Spinner />}
      {status === 'rejected' && notifyError(error)}
      {total === 0 && notifyError('Cannot find images')}
      {(status === 'resolved' || images.length > 0) && (
        <ImageGallery images={images} showModal={onShowModal} />
      )}
      {Boolean(images?.length) && total >= page * 12 && (
        <Button onClick={handleLoadMoreClick} />
      )}
      <ToastContainer autoClose={2500} />
    </div>
  );
};

export default App;
