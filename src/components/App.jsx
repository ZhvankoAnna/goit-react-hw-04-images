import { Component } from 'react';
import { searchImg } from 'services/getFetch';
import Searchbar from './Searchbar/Searchbar';
import Spinner from 'shared/components/Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from '../shared/components/Button/Button';
import { ToastContainer, toast } from 'react-toastify';
import Modal from '../shared/components/Modal/Modal';
import css from './app.module.css';

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
