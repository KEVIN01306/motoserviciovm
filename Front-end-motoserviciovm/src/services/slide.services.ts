import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { SlideType } from '../types/slideType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_SLIDES = API_URL + 'slides';

const getSlides = async (): Promise<SlideType[]> => {
  try {
    const response = await api.get<apiResponse<SlideType[]>>(API_SLIDES);
    const items = response.data.data;

    if (!Array.isArray(items)) {
      throw new Error('INVALID_API_RESPONSE_FORMAT');
    }

    return items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const getSlide = async (id: SlideType['id']): Promise<SlideType> => {
  try {
    const response = await api.get<apiResponse<SlideType>>(`${API_SLIDES}/${id}`);
    const item = response.data.data;

    if (!item) {
      throw new Error('DATA_NOT_FOUND');
    }

    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }
      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const postSlide = async (payload: FormData): Promise<SlideType> => {
  try {
    const response = await api.post<apiResponse<SlideType>>(API_SLIDES, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? ({} as SlideType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const putSlide = async (id: SlideType['id'], payload: FormData): Promise<SlideType> => {
  try {
    const response = await api.put<apiResponse<SlideType>>(`${API_SLIDES}/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? ({} as SlideType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

const deleteSlide = async (id: SlideType['id'] | undefined): Promise<SlideType> => {
  try {
    const response = await api.delete<apiResponse<SlideType>>(`${API_SLIDES}/${id}`);
    return response.data.data ?? ({} as SlideType);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('NOT FOUND API OR NOT EXISTED IN THE SERVER');
      }

      if (status === 500) {
        throw new Error('INTERNAL ERROR SERVER');
      }

      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        throw new Error(serverMessage);
      }

      throw new Error('CONNECTION ERROR');
    }

    throw new Error((error as Error).message);
  }
};

export { getSlides, getSlide, postSlide, putSlide, deleteSlide };
