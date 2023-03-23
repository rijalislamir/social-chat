import axios from 'axios'

export const login = async (data: { email: string, password: string }) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, data)
  
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
