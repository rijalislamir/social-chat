import { User } from '../types';

export const getConversationName = (
  name: string,
  selfUserId: string,
  users: User[]
) => {
  if (users.length > 2) return name;

  let conversationName = '';

  users.forEach((user: User, i: number) => {
    if (users.length === 2 && user.id === selfUserId) return;

    conversationName +=
      i !== users.length - 1 && users.length > 2 ? `${user.name}, ` : user.name;
  });

  return conversationName;
};
