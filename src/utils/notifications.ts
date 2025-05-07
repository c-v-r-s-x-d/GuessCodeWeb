import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notify = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
};

export const handleApiError = (error: any) => {
  // Проверяем, является ли ошибка объектом с response (Axios error)
  if (error.response) {
    const status = error.response.status;
    console.log(status)
    const message = error.response.data?.message || 'An error occurred';

    switch (status) {
      case 400:
        notify.error('Invalid request: ' + message);
        break;
      case 401:
        notify.error('Unauthorized: Please login to continue');
        break;
      case 403:
        notify.error('Access denied: You don\'t have permission to perform this action');
        break;
      case 404:
        notify.error('Resource not found: ' + message);
        break;
      case 500:
        notify.error('Server error: Please try again later');
        break;
      default:
        notify.error(message);
    }
  } else if (error.message === 'Network response was not ok') {
    // Обработка ошибки сети из fetch
    notify.error('Server error: Please try again later');
  } else if (error.request) {
    // Ошибка сети (нет ответа от сервера)
    notify.error('Network error: Please check your connection');
  } else {
    // Другие ошибки
    notify.error(error.message || 'An unexpected error occurred');
  }
}; 