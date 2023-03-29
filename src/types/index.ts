// TODO: - make sure no optional prop on types

export type User = {
  id: string;
  name: string;
  email: string;
  userId?: string;
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

export type UserX = {
  id: string;
  name: string;
  email: string;
};

export type Conversation = {
  id: string;
  messages: MessageX[];
  name: string;
  users: UserX[];
};

export type UpdateConverstaion = {
  conversationId: string;
  userId: string | null;
  name: string;
  users: UserX[];
  messages: MessageX[] | null;
  message: string | null;
};

export type MessageX = {
  userId: string;
  message: string;
  id?: string;
  conversationId?: string;
  createdAt?: string;
  updatedAt?: string;
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
