import { httpClient } from './apiClient';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export const makeRequest = async <T = any>(
  method: Method,
  url: string,
  data?: any,
): Promise<T> => {
  try {
    const response = await httpClient({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    throw error; // error는 인터셉터에서 처리하기!
  }
};
