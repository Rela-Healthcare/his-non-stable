import axiosInstance from './axiosInstance';

type HTTPMethod = 'get' | 'post' | 'put' | 'delete';

const apiRequest = async (
  method: HTTPMethod,
  url: string,
  body: Record<string, any> | null = null
): Promise<{data: any; status: 'success' | 'error'}> => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: body,
    });

    return {data: response.data, status: 'success'};
  } catch (error: any) {
    return {
      data: error.response
        ? error.response.data
        : 'An unexpected error occurred.',
      status: 'error',
    };
  }
};

const requests = {
  get: (url: string) => apiRequest('get', url),
  post: (url: string, body: Record<string, any>) =>
    apiRequest('post', url, body),
  put: (url: string, body: Record<string, any>) => apiRequest('put', url, body),
  delete: (url: string, body?: Record<string, any>) =>
    apiRequest('delete', url, body),
};

export default requests;

export type {HTTPMethod};

export {apiRequest};
