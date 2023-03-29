<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user'
import { useConversationStore } from './stores/conversation';
import { getConversationMessages } from './apis/message'
import { getUser, getConversationUsers, logout } from './apis/user'
import { getUserConversations, createUserConversation } from './apis/conversation'
import { socket } from "./socket";

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()
const conversationStore = useConversationStore()

onBeforeMount(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const token = cookies.get('accesstoken')
  const { success: successGetUser, user } = await getUser({ token })

  if (!successGetUser) {
    logout({ router })
    return
  }

  userStore.setUser({
    newId: user.id,
    newName: user.name,
    newEmail: user.email
  })
  socket.auth = {
    userId: user.id,
    email: user.email,
    name: user.name
  };
  socket.connect()

  const { success: successGetUserConversations, conversations } = await getUserConversations({ userId: user.id })

  if (!successGetUserConversations) return

  for (let { conversationId, name } of conversations) {
    const { success: successGetConversationMessage, messages } = await getConversationMessages({ conversationId })
    if (!successGetConversationMessage) return

    const { success: successGetConversationUsers, users } = await getConversationUsers({ conversationId })
    if (!successGetConversationUsers) return

    conversationStore.updateData({
      conversationId,
      userId: null,
      name,
      users,
      messages,
      message: null
    })
  }
})

onUnmounted(() => {
  socket.off("connect_error")
})

socket.on("connect_error", (err) => {
  if (err.message === "invalid email") logout({ router })
});

socket.on("onlineUsers", (users) => {
  users.forEach((user: any) => {
    user.self = user.socketId === socket.id;
    userStore.onlineUsers.push(user)
  });
});

socket.on("newUser", (user) => {
  user.self = user.socketId === socket.id;
  userStore.onlineUsers.push(user);
});

socket.on('exitUser', ({ socketId }) => {
  userStore.onlineUsers = userStore.onlineUsers.filter((user: any) => user.socketId !== socketId)
})

socket.on('fetchMessage',async ({ message, conversationId, userId, senderEmail, senderName }: any) => {
  const { success } = await createUserConversation({ userId: userStore.id, conversationId })

  if (!success) return

  // TODO: conversation name should be dynamic
  const name = userStore.name
  // TODO: adjust this after implementing group chat  
  const users = [{ id: userStore.id, name: userStore.name, email: userStore.email }, { id: userId, name: senderName, email: senderEmail }]
  
  conversationStore.updateData({
    conversationId,
    userId,
    name,
    users,
    messages: null,
    message
  })

})
</script>
