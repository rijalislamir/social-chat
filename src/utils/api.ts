import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import { socket } from '../socket'
import { getBackendURL } from './env'

const { cookies } = useCookies()
const URL = getBackendURL()

export const login = async (data: { email: string, password: string }) => {
  try {
    const res = await axios.post(`${URL}/login`, data)
  
    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

// TODO: rid off any type
export const logout = ({ router }: { router: any }) => {
  cookies.remove('accesstoken')
  socket.disconnect()
  router.push('/login')
  router.go()
}

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${URL}/users/all`)

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const getUser = async (data: { token: string }) => {
  try {
    const { token } = data
    const res = await axios.get(
      `${URL}/users`,
      { headers: { "Authorization": `Bearer ${token}`}}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const createUser = async (data: { name: string, email: string, password: string}) => {
  try {
    const res = await axios.post(`${URL}/users`, data)

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
      success: false,
      message: 'There is no access token on cookie!'
    }

    const res = await axios.put(
      `${URL}/users/${id}`,
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
      `${URL}/users/${id}`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )
    
    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const createConversation = async (data: { name: string }) => {
  try {
    const token = cookies.get('accesstoken')
  
    const res = await axios.post(
      `${URL}/conversations`,
      data,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const getUserConversations = async (data: { userId: string }) => {
  try {
    const { userId } = data
    const token = cookies.get('accesstoken')

    const res = await axios.get(
      `${URL}/users/${userId}/conversations`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const createUserConversation = async (data: { userId: string, conversationId: string }) => {
  try {
    const { userId, conversationId } = data
    const token = cookies.get('accesstoken')

    const res = await axios.post(
      `${URL}/users/${userId}/conversations/${conversationId}`,
      null,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const createMessage = async (data: { conversationId: string, userId: string, message: string }) => {
  try { 
    const token = cookies.get('accesstoken')
    
    const res = await axios.post(
      `${URL}/messages`,
      data,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const getConversationMessages = async (data: { conversationId: string }) => {
  try {
    const { conversationId } = data
    const token = cookies.get('accesstoken')

    const res = await axios.get(
      `${URL}/conversations/${conversationId}/messages`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}

export const getConversationUsers = async (data: { conversationId: string }) => {
  try {
    const { conversationId } = data
    const token = cookies.get('accesstoken')

    const res = await axios.get(
      `${URL}/conversations/${conversationId}/users`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}