import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Conversation } from '../types';

export const useConversationStore = defineStore('conversation', () => {
  const data = ref<{ [key: string]: Conversation }>({});

  const isEmpty = () => {
    return Object.keys(data.value).length === 0;
  };

  const updateData = (conversationData: Conversation) => {
    const { conversationId, userId, name, users, messages, message } =
      conversationData;

    if (!conversationId) return;

    switch (true) {
      case !Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
        messages &&
        !message:
        if (conversationId)
          data.value[conversationId] = {
            id: conversationId,
            name,
            users,
            messages,
          };
        break;

      case !Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
        !messages &&
        message &&
        !!userId:
        if (message && userId)
          data.value[conversationId] = {
            id: conversationId,
            name,
            users,
            messages: [{ message, userId }],
          };
        break;

      case Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
        message &&
        !!userId:
        if (message && userId)
          data.value[conversationId].messages?.push({ message, userId });
        break;

      default:
        break;
    }
  };

  const getConversationMessages = ({
    conversationId,
  }: {
    conversationId: string;
  }) => {
    if (Object.prototype.hasOwnProperty.call(data.value, conversationId))
      return data.value[conversationId].messages;
  };

  const reset = () => {
    data.value = {};
  };

  return { data, isEmpty, updateData, getConversationMessages, reset };
});
