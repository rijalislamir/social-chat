<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user';
import { useConversationStore } from './stores/conversation';
import { useUiStore } from './stores/ui';
import { getConversationMessages } from './apis/message';
import { getUser, getConversationUsers, logout } from './apis/user';
import {
  getUserConversations,
  createUserConversation,
} from './apis/conversation';
import { connectSocket, socket } from './utils/socket';
import { OnlineUser, FetchMessage } from './types';

const { cookies } = useCookies();
const router = useRouter();
const userStore = useUserStore();
const conversationStore = useConversationStore();
const uiStore = useUiStore();

onMounted(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const { success: successGetUser, user } = await getUser();

  if (!successGetUser || !user) {
    logout(router);
    return;
  }

  userStore.setUser(user.id, user.name, user.email, user.profilePicture);
  connectSocket(user.id, user.name, user.email);

  const { success: successGetUserConversations, conversations } =
    await getUserConversations(user.id);

  if (!successGetUserConversations) return;

  for (const { conversationId, name } of conversations) {
    const { success: successGetConversationMessage, messages } =
      await getConversationMessages(conversationId);
    if (!successGetConversationMessage) return;

    const { success: successGetConversationUsers, users } =
      await getConversationUsers(conversationId);
    if (!successGetConversationUsers) return;

    conversationStore.updateData(
      {
        conversationId,
        userId: null,
        name,
        users,
        messages,
        message: null,
        userEmail: '',
        userName: '',
      },
      userStore
    );
  }

  uiStore.isLoading = false;
});

onUnmounted(() => {
  socket.off('connect_error');
});

socket.on('connect_error', (err) => {
  if (err.message === 'invalid email') logout(router);
});

socket.on('onlineUsers', (users) => {
  users.forEach((user: OnlineUser) => {
    user.self = user.socketId === socket.id;
    userStore.onlineUsers.push(user);
  });
});

socket.on('newUser', (user) => {
  user.self = user.socketId === socket.id;
  userStore.onlineUsers.push(user);
});

socket.on('exitUser', ({ socketId }) => {
  userStore.onlineUsers = userStore.onlineUsers.filter(
    (user: OnlineUser) => user.socketId !== socketId
  );
});

socket.on(
  'fetchMessage',
  async ({
    message,
    conversationId,
    userId,
    users,
    userEmail,
    userName,
  }: FetchMessage) => {
    const { success } = await createUserConversation(
      userStore.id,
      conversationId
    );

    if (!success) return;

    conversationStore.updateData(
      {
        conversationId,
        userId,
        name: userStore.name,
        users,
        messages: null,
        message,
        userEmail,
        userName,
      },
      userStore
    );
  }
);
</script>
