import axios from 'axios'

export const login = async (data: { email: string, password: string }) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, data)

  return res.data
}

export const createUser = async (data: { name: string, email: string, password: string}) => {
  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, data)

  return res.data
}

export const deleteUser = async (data: { id: string, token: string }) => {
  const { id, token } = data

  const res = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/users/${id}`,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  )
  
  return res.data
}
