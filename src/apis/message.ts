import axios, { AxiosError } from 'axios';
import { useCookies } from 'vue3-cookies';
import { getBackendURL } from '../utils/env';

const { cookies } = useCookies();
const URL = getBackendURL();

export const createMessage = async (
  conversationId: string,
  userId: string,
  message: string
) => {
  try {
    const token = cookies.get('accesstoken');

    const res = await axios.post(
      `${URL}/messages`,
      { conversationId, userId, message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const getConversationMessages = async (conversationId: string) => {
  try {
    const token = cookies.get('accesstoken');

    const res = await axios.get(
      `${URL}/conversations/${conversationId}/messages`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const deleteUserMessages = async (userId: string) => {
  try {
    const token = cookies.get('accesstoken');

    const res = await axios.delete(`${URL}/users/${userId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};
