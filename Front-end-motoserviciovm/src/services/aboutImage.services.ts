import axios from 'axios';
import { api } from '../axios/axios';
import type { apiResponse } from '../types/apiResponse';
import type { AboutImageType } from '../types/aboutImageType';

const API_URL = import.meta.env.VITE_DOMAIN;
const API_ABOUT_IMAGES = API_URL + 'aboutImage';

const getAboutImages = async (): Promise<AboutImageType[]> => {
  try {
    const response = await api.get<apiResponse<AboutImageType[]>>(API_ABOUT_IMAGES);
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

const getAboutImage = async (id: AboutImageType['id']): Promise<AboutImageType> => {
  try {
    const response = await api.get<apiResponse<AboutImageType>>(`${API_ABOUT_IMAGES}/${id}`);
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

const postAboutImage = async (payload: FormData): Promise<AboutImageType> => {
  try {
    const response = await api.post<apiResponse<AboutImageType>>(API_ABOUT_IMAGES, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? ({} as AboutImageType);
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

const putAboutImage = async (id: AboutImageType['id'], payload: FormData): Promise<AboutImageType> => {
  try {
    const response = await api.put<apiResponse<AboutImageType>>(`${API_ABOUT_IMAGES}/${id}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data ?? ({} as AboutImageType);
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

const deleteAboutImage = async (id: AboutImageType['id'] | undefined): Promise<AboutImageType> => {
  try {
    const response = await api.delete<apiResponse<AboutImageType>>(`${API_ABOUT_IMAGES}/${id}`);
    return response.data.data ?? ({} as AboutImageType);
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

export { getAboutImages, getAboutImage, postAboutImage, putAboutImage, deleteAboutImage };
