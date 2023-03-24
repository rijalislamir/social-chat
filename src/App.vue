<template>
  <router-view />
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/user'
import { getUser, logout } from './utils/api'

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()

onBeforeMount(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const token = cookies.get('accesstoken')
  const res = await getUser({ token })

  switch (res.status) {
    case 'success':
      userStore.setUser({
        newId: res.user.id,
        newName: res.user.name,
        newEmail: res.user.email
      })
      break;

    case 'failed':
      logout({ router, userStore })
      break;
  
    default:
      break;
  }
})
</script>
