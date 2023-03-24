import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const { cookies } = useCookies()

export const login = async (data: { email: string, password: string }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, data)
  
    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

// TODO: rid off any type
export const logout = ({ router, userStore }: { router: any, userStore: any }) => {
  cookies.remove('accesstoken')
  userStore.resetUser()
  router.push('/login')
}

export const getUser = async (data: { token: string }) => {
  try {
    const { token } = data
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/users`,
      { headers: { "Authorization": `Bearer ${token}`}}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const createUser = async (data: { name: string, email: string, password: string}) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, data)

    return res.data
  } catch (error: any) { // TODO: rid off any type
    if (error.response.data?.message?.code === 'ER_DUP_ENTRY') {
      error.response.data.message = 'Email already registered!'
    }

    return error.response.data
  }
}

export const updateUser = async (data: { id: string, name: string }) => {
  try {
    const { id, name } = data
    const token = cookies.get('accesstoken')

    if (!token) return {
      status: 'failed',
      message: 'There is no access token on cookie!'
    }

    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
      { name },
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const deleteUser = async (data: { id: string, token: string }) => {
  try {
    const { id, token } = data

    const res = await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )
    
    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}
