import { ref } from 'vue';
import { defineStore } from 'pinia';
import { Conversation, UpdateConverstaion } from '../types';
import moment from 'moment';

export const useConversationStore = defineStore('conversation', () => {
  const data = ref<{ [key: string]: Conversation }>({});

  const isEmpty = () => {
    return Object.keys(data.value).length === 0;
  };

  const updateData = (conversationData: UpdateConverstaion) => {
    const { conversationId, userId, name, users, messages, message } =
      conversationData;

    if (!conversationId) return;

    const currentDatetime = moment().utc().format();

    if (
      !Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
      messages &&
      !message
    ) {
      if (conversationId) {
        data.value[conversationId] = {
          id: conversationId,
          name,
          users,
          messages,
        };
      }
    } else if (
      !Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
      !messages &&
      message &&
      !!userId
    ) {
      if (message && userId) {
        data.value[conversationId] = {
          id: conversationId,
          name,
          users,
          messages: [
            {
              conversationId: '',
              createdAt: currentDatetime,
              id: '',
              message,
              updatedAt: currentDatetime,
              userId,
            },
          ],
        };
      }
    } else if (
      Object.prototype.hasOwnProperty.call(data.value, conversationId) &&
      message &&
      !!userId
    ) {
      if (message && userId) {
        data.value[conversationId].messages?.push({
          conversationId: '',
          createdAt: currentDatetime,
          id: '',
          message,
          updatedAt: currentDatetime,
          userId,
        });
      }
    }
  };

  const reset = () => {
    data.value = {};
  };

  return { data, isEmpty, updateData, reset };
});
