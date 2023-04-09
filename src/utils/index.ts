import { Conversation, User, Message } from '../types';
import { ConversationStore } from '../types';
import moment from 'moment';
import { i18n } from '../locales';

const { t } = i18n.global;

export const getConversationName = (
  name: string,
  selfUserId: string,
  users: User[]
) => {
  let conversationName = '';

  users.forEach((user: User, i: number) => {
    if (users.length === 2 && user.id === selfUserId) return;

    conversationName +=
      i !== users.length - 1 && users.length > 2 ? `${user.name}, ` : user.name;
  });

  return conversationName;
};

export const getConversationDatetime = (messages: Message[]) => {
  let seconds, minutes, hours;
  const latestMessageDatetime = messages[messages.length - 1].createdAt;

  switch (true) {
    case moment().diff(latestMessageDatetime, 'seconds') < 60:
      seconds = moment().diff(latestMessageDatetime, 'seconds');
      return seconds ? t('Time.Second', seconds) : t('Time.Now');

    case moment().diff(latestMessageDatetime, 'minutes') < 60:
      minutes = moment().diff(latestMessageDatetime, 'minutes');
      return t('Time.Minute', minutes);

    case moment().diff(latestMessageDatetime, 'hours') < 24:
      hours = moment().diff(latestMessageDatetime, 'hours');
      return t('Time.Hour', hours);

    case moment().diff(latestMessageDatetime, 'days') === 1:
      return t('Time.Yesterday');

    default:
      return moment(latestMessageDatetime).format('M/DD');
  }
};

export const searchConversation = (
  conversationStore: ConversationStore,
  conversationName: string
) => {
  const conversations: { [key: string]: Conversation } = {};

  for (const conversationId in conversationStore.data) {
    if (
      conversationStore.data[conversationId].name.includes(conversationName)
    ) {
      conversations[conversationId] = conversationStore.data[conversationId];
    }
  }

  return conversationName ? conversations : conversationStore.data;
};
