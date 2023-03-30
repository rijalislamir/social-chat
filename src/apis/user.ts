import axios, { AxiosError } from 'axios';
import { useCookies } from 'vue3-cookies';
import { Router } from 'vue-router';
import { socket } from '../utils/socket';
import { getBackendURL } from '../utils/env';

const { cookies } = useCookies();
const URL = getBackendURL();

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post(`${URL}/login`, { email, password });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const logout = (router: Router) => {
  cookies.remove('accesstoken');
  socket.disconnect();
  router.push('/login');
  router.go(0);
};

// TODO: use it or delete it if not used
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${URL}/users/all`);

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const getUser = async () => {
  try {
    const token = cookies.get('accesstoken');
    const res = await axios.get(`${URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response)
      return error.response.data;
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const res = await axios.post(`${URL}/users`, { name, email, password });

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

export const updateUser = async (id: string, name: string) => {
  try {
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

export const deleteUser = async (id: string) => {
  try {
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

export const getConversationUsers = async (conversationId: string) => {
  try {
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
