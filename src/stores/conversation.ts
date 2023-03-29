import { ref } from 'vue'
import { defineStore } from 'pinia'

type UserDataType = {
  id: string,
  name: string,
  email: string
}

type ConversationDataType = {
  conversationId: string,
  userId: string | null,
  name: string,
  users: Array<UserDataType>,
  messages: string | null,
  message: string | null 
}

export const useConversationStore = defineStore('conversation', () => {
  const data = ref<any>({})

  const isEmpty = () => {
    return Object.keys(data.value).length === 0
  }

  const updateData = (conversationData: ConversationDataType) => {
    const {
      conversationId,
      userId,
      name,
      users,
      messages,
      message
    } = conversationData

    switch (true) {
      case !data.value.hasOwnProperty(conversationId) && messages && !message:
        data.value[conversationId] = {
          id: conversationId,
          name,
          users,
          messages
        }
        break

      case !data.value.hasOwnProperty(conversationId) && !messages && message && !!userId:
        data.value[conversationId] = {
          id: conversationId,
          name,
          users,
          messages: [{ message, userId }]
        }
        break

      case data.value.hasOwnProperty(conversationId) && message && !!userId:
        data.value[conversationId].messages.push({ message, userId })
        break

      default:
        break;
      }
  }

  const getConversationMessages = ({ conversationId }: { conversationId: string }) => {
    if (data.value.hasOwnProperty(conversationId)) return data.value[conversationId].messages
  }

  const reset = () => {
    data.value = {}
  }

  return { data, isEmpty, updateData, getConversationMessages, reset }
})
