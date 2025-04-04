import axios from 'axios';

const httpClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_MOCKING === 'enabled'
      ? process.env.MOCK_BASE_URL
      : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// 응답 인터셉터
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      if (message === 'Token expired') {
        window.dispatchEvent(new CustomEvent('tokenExpired'));
      } else {
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
    }

    return Promise.reject(error);
  },
);

export default httpClient;
