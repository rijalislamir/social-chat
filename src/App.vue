<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user'
import { useConversationStore } from './stores/conversation';
import { getUser, logout } from './utils/api'
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

  socket.auth = { email: res.user.email, name: res.user.name };
  socket.connect()
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

socket.on('fetchMessage', ({ message, senderEmail, senderName }: any) => {
  conversationStore.history[senderEmail] = {
    name: senderName,
    email: senderEmail,
    message: 
        conversationStore.history.hasOwnProperty(senderEmail)
          ? [...conversationStore.history[senderEmail].message, { message, senderEmail }]
          : [{ message, senderEmail }]
  }
})
</script>
