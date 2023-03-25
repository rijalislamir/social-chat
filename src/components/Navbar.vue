<template>
  <div class="bg-custom-gray flex justify-center p-4">
    <div
      class="flex flex-col justify-center flex-1 text-center"
      @click="() => router.push('/')"
    >
      Chat
    </div>

    <div
      class="flex flex-col justify-center flex-1 text-center"
      @click="() => router.push('/profile')"
    >
      Profile
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
</script>