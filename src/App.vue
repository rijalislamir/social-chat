<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user'
import { useConversationStore } from './stores/conversation';
import {
  getUser,
  getUserConversations,
  createUserConversation,
  getConversationMessages,
  getConversationUsers,
  logout
} from './utils/api'
import { socket } from "./socket";

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()
const conversationStore = useConversationStore()

onBeforeMount(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const token = cookies.get('accesstoken')
  const res = await getUser({ token })

  if (!res.success) {
    logout({ router })
    return
  }

  userStore.setUser({
    newId: res.user.id,
    newName: res.user.name,
    newEmail: res.user.email
  })

  socket.auth = {
    userId: res.user.id,
    email: res.user.email,
    name: res.user.name
  };
  socket.connect()

  const response = await getUserConversations({ userId: res.user.id })

  if (response.success) {
    for (let { conversationId, name } of response.conversations) {
      const { messages } = await getConversationMessages({ conversationId })
      const { users } = await getConversationUsers({ conversationId })
      
      conversationStore.data[conversationId] = {
        id: conversationId,
        name,
        users,
        messages
      }
    }
  }
})

onUnmounted(() => {
  socket.off("connect_error")
})

socket.on("connect_error", (err) => {
  if (err.message === "invalid email") {
    logout({ router })
  }
});

socket.on("onlineUsers", (users) => {
  users.forEach((user: any, i: number) => {
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

  if (conversationStore.data.hasOwnProperty(conversationId)) {
    conversationStore.data[conversationId].messages = conversationStore.data.hasOwnProperty(conversationId)
      ? [...conversationStore.data[conversationId].messages, { message, userId }]
      : [{ message, senderEmail: userStore.email, userId }]
  } else {
    conversationStore.data[conversationId] = {
        id: conversationId,
        // TODO: adjust this after implementing group chat  
        users: [{ id: userStore.id, name: userStore.name, email: userStore.email }, { id: userId, name: senderName, email: senderEmail }],
        // TODO: conversation name should dynamic
        name: userStore.name,
        messages:
          conversationStore.data.hasOwnProperty(conversationId)
            ? [...conversationStore.data[conversationId].messages, { message, userId }]
            : [{ message, userId }]
      }   
  }

})
</script>
