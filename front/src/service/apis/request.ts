import httpClient from './httpClient';
// 이걸 기반으로 요청 메서드를 추상화한 요청 유틸임
// -> axios를 직접 쓰지 말고 request를 통해서 간접적으로 사용하기.

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestPayload {
  data?: unknown;
  params?: Record<string, unknown>;
}

const makeRequest = async <T>(
  method: Method,
  url: string,
  payload?: RequestPayload,
): Promise<T> => {
  const response = await httpClient({
    method,
    url,
    data: payload?.data,
    params: payload?.params,
  });

  return response.data;
};

const request = {
  GET: <T>(url: string, params?: Record<string, unknown>) =>
    makeRequest<T>('GET', url, { params }),
  POST: <T>(url: string, data?: unknown) =>
    makeRequest<T>('POST', url, { data }),
  PUT: <T>(url: string, data?: unknown) => makeRequest<T>('PUT', url, { data }),
  DELETE: <T>(url: string) => makeRequest<T>('DELETE', url),
};

export default request;
