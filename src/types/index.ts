export type User = {
  id: string;
  name: string;
  email: string;
};

export type Message = {
  conversationId: string;
  createdAt: string;
  id: string;
  message: string;
  updatedAt: string;
  userId: string;
};

export type Conversation = {
  id: string;
  messages: Message[];
  name: string;
  users: User[];
};

export type UpdateConverstaion = {
  conversationId: string;
  userId: string | null;
  name: string;
  users: User[];
  messages: Message[] | null;
  message: string | null;
};

export type OnlineUser = {
  socketId: string;
  userId: string;
  name: string;
  email: string;
  self: boolean;
  isSelected: boolean;
};

export type FetchMessage = {
  message: string;
  conversationId: string;
  userId: string;
  senderEmail: string;
  senderName: string;
};
