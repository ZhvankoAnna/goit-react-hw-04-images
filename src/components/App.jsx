import { useState, useEffect, useRef } from 'react';
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

  const firstRender = useRef(true);

  useEffect(() => {
    if(firstRender.current){
      firstRender.current = false;
      return;
    }
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

    setStatus('pending');
    getFetch();
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

/*
export class App extends Component {
  state = {
    search: '',
    images: [],
    page: 1,
    total: null,
    status: 'idle',
    error: null,
    showModal: false,
    imageProps: {},
  };

  componentDidUpdate(_, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.setState({ status: 'pending' });
      this.getFetch();
    }
  }

  getFormData = data => {
    const { search } = this.state;
    if (search !== data) {
      this.setState({ search: data, images: [], page: 1, total: null });
    }
  };

  async getFetch() {
    try {
      const { search, page } = this.state;
      const { data } = await searchImg(search, page);
      this.setState(({ images }) => ({
        images: [...images, ...data.hits],
        total: data.total,
        status: 'resolved',
      }));
    } catch ({ error }) {
      this.setState({
        error: error.data.message || 'Cannot fetch images.',
        status: 'rejected',
      });
    }
  }

  handleLoadMoreClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  notifyError = message => {
    toast.error(message);
  };

  showModal = ({ largeImageURL, tags }) => {
    this.setState({
      showModal: true,
      imageProps: {
        largeImageURL,
        tags,
      },
    });
  };

  closeModal = () => {
    this.setState({ showModal: false, imageProps: {} });
  };

  render() {
    const {
      images,
      page,
      status,
      error,
      total,
      showModal,
      imageProps,
    } = this.state;

    return (
      <div className={css.app}>
        {showModal && (
          <Modal onClose={this.closeModal}>
            <img src={imageProps.largeImageURL} alt={imageProps.tags} />
          </Modal>
        )}
        <Searchbar onSubmit={this.getFormData} />
        {status === 'pending' && <Spinner />}
        {status === 'rejected' && this.notifyError(error)}
        {total === 0 && this.notifyError('Cannot find images')}
        {(status === 'resolved' || images.length > 0) && (
          <ImageGallery images={images} showModal={this.showModal} />
        )}
        {Boolean(images?.length) && total >= page * 12 && (
          <Button onClick={this.handleLoadMoreClick} />
        )}
        <ToastContainer autoClose={2500} />
      </div>
    );
  }
}
*/
