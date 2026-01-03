import axios, { AxiosInstance } from 'axios';
import config from '../config';

let axiosInstance: AxiosInstance;
let token: string;

export const createAxiosInstance = (accessToken: string) => {
  if (!axiosInstance || accessToken !== token) {
    token = accessToken;
    axiosInstance = axios.create({
      baseURL: config.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  return axiosInstance;
};

export type ApiClient = ReturnType<typeof createAxiosInstance>;
