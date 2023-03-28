import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConversationStore = defineStore('conversation', () => {
  const history = ref<any>({})
  const data = ref<any>({})

  const reset = () => {
    history.value = {}
  }

  return { data, history, reset }
})
