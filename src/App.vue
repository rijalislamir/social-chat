<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from 'vue';
import { useCookies } from 'vue3-cookies';

import { useUserStore } from './stores/user'
import { getUser } from './utils/api'

const { cookies } = useCookies()
const userStore = useUserStore()

onBeforeMount(async () => {
  if (!cookies.isKey('accesstoken')) return;

  const token = cookies.get('accesstoken')
  const res = await getUser({ token })

  if (res.status === 'success') {
    userStore.setUser({
      newId: res.user.id,
      newName: res.user.name,
      newEmail: res.user.email
    })
  }
})
</script>
