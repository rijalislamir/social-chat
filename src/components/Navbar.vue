<template>
  <div class="flex justify-center cursor-pointer">
    <div
      class="bg-custom-gray p-6 hover:bg-gray-700 flex flex-col justify-center flex-1 text-center hover:font-bold"
      @click="() => router.push('/')"
    >
      Chat
    </div>

    <div
      class="bg-custom-gray p-6 hover:bg-gray-700 flex flex-col justify-center flex-1 text-center hover:font-bold"
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