<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user'
import { getUser, logout } from './utils/api'
import { socket } from "./socket";

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()

onUnmounted(() => {
  socket.off("connect_error")
})

onBeforeMount(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const token = cookies.get('accesstoken')
  const res = await getUser({ token })

  if (!res.success) {
    logout({ router, userStore })
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

socket.on("connect_error", (err) => {
  if (err.message === "invalid email") {
    logout({ router, userStore })
  }
});
</script>
