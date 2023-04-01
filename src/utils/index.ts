import { User, Message } from '../types';
import moment from 'moment';

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
      return seconds ? `${seconds} second${seconds > 1 ? 's' : ''} ago` : 'Now';

    case moment().diff(latestMessageDatetime, 'minutes') < 60:
      minutes = moment().diff(latestMessageDatetime, 'minutes');
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    case moment().diff(latestMessageDatetime, 'hours') < 24:
      hours = moment().diff(latestMessageDatetime, 'hours');
      return `${hours} minute${hours > 1 ? 's' : ''} ago`;

    case moment().diff(latestMessageDatetime, 'days') === 1:
      return 'Yesterday';

    default:
      return moment(latestMessageDatetime).format('M/DD');
  }
};
