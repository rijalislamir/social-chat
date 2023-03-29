import axios, { AxiosError } from 'axios';
import { useCookies } from 'vue3-cookies';
import { getBackendURL } from '../utils/env';

const { cookies } = useCookies();
const URL = getBackendURL();

export const createConversation = async (data: { name: string }) => {
  try {
    const token = cookies.get('accesstoken');

    const res = await axios.post(`${URL}/conversations`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const getUserConversations = async (data: { userId: string }) => {
  try {
    const { userId } = data;
    const token = cookies.get('accesstoken');

    const res = await axios.get(`${URL}/users/${userId}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const createUserConversation = async (data: {
  userId: string;
  conversationId: string;
}) => {
  try {
    const { userId, conversationId } = data;
    const token = cookies.get('accesstoken');

    const res = await axios.post(
      `${URL}/users/${userId}/conversations/${conversationId}`,
      null,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const deleteUserConversations = async (data: { userId: string }) => {
  try {
    const { userId } = data;
    const token = cookies.get('accesstoken');

    const res = await axios.delete(`${URL}/users/${userId}/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};
