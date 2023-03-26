import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useConversationStore = defineStore('conversation', () => {
  const history = ref<any>({})

  return { history }
})
