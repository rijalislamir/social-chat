// TODO: - make sure no optional prop on types

export type User = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  self?: boolean;
  socketId?: string;
  isSelected?: boolean;
  users?: User[];
};

export type OnlineUser = {
  socketId: string;
  userId: string;
  name: string;
  email: string;
  self?: boolean;
  isSelected?: boolean;
};

export type Message = {
  id?: string;
  conversationId?: string;
  userId: string;
  message: string;
};

export type FetchMessage = {
  message: string;
  conversationId: string;
  userId: string;
  senderEmail: string;
  senderName: string;
};

export type Conversation = {
  id?: string;
  conversationId?: string;
  userId?: string | null;
  name: string;
  users: Array<User>;
  messages: Message[] | null;
  message?: string | null;
};
