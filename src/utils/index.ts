import { User } from '../types';

export const getConversationName = (
  name: string,
  selfUserId: string,
  users: User[]
) => {
  if (users.length > 2) return name;

  let title = '';

  users.forEach((user: User, i: number) => {
    if (users.length === 2 && user.id === selfUserId) return;

    title += user.name;

    if (i !== users.length - 1) title += ', ';
  });

  return title;
};
