import axios, { AxiosError } from 'axios';
import { useCookies } from 'vue3-cookies';
import { Router } from 'vue-router';
import { socket } from '../utils/socket';
import { getBackendURL } from '../utils/env';

const { cookies } = useCookies();
const URL = getBackendURL();

export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await axios.post(`${URL}/login`, data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const logout = ({ router }: { router: Router }) => {
  cookies.remove('accesstoken');
  socket.disconnect();
  router.push('/login');
  router.go(0);
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${URL}/users/all`);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const getUser = async (data: { token: string }) => {
  try {
    const { token } = data;
    const res = await axios.get(`${URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${URL}/users`, data);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      if (error.response.data?.message?.code === 'ER_DUP_ENTRY') {
        error.response.data.message = 'Email already registered!';
      }

      return error.response.data;
    }
  }
};

export const updateUser = async (data: { id: string; name: string }) => {
  try {
    const { id, name } = data;
    const token = cookies.get('accesstoken');

    if (!token)
      return {
        success: false,
        message: 'There is no access token on cookie!',
      };

    const res = await axios.put(
      `${URL}/users/${id}`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const deleteUser = async (data: { id: string }) => {
  try {
    const { id } = data;
    const token = cookies.get('accesstoken');

    const res = await axios.delete(`${URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const getConversationUsers = async (data: {
  conversationId: string;
}) => {
  try {
    const { conversationId } = data;
    const token = cookies.get('accesstoken');

    const res = await axios.get(
      `${URL}/conversations/${conversationId}/users`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};
