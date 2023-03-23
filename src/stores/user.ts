import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore= defineStore('user', () => {
  const id = ref('')
  const name = ref('')
  const email = ref('')

  const setUser = ({ newId, newName, newEmail}: { newId: string, newName: string, newEmail: string }) => {
    console.log('setUser', newId, newName, newEmail)
    id.value = newId
    name.value = newName
    email.value = newEmail
  }

  const resetUser = () => {
    id.value = ''
    name.value = ''
    email.value = ''
  }

  return { id, name, email, setUser, resetUser }
})
