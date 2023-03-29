import axios from 'axios'
import { useCookies } from 'vue3-cookies'
import { getBackendURL } from '../utils/env'

const { cookies } = useCookies()
const URL = getBackendURL()

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

export const deleteUserMessages = async (data: { userId: string }) => {
  try {
    const { userId } = data
    const token = cookies.get('accesstoken')

    const res = await axios.delete(
      `${URL}/users/${userId}/messages`,
      { headers: { "Authorization": `Bearer ${token}` }}
    )

    return res.data
  } catch (error: any) { // TODO: rid off any type
    return error.response.data
  }
}
