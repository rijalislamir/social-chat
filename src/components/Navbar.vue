<template>
  <div class="bg-[#3B3B3B] flex justify-center fixed left-0 bottom-0 right-0 h-16">
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