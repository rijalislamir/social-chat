<template>
  <div class="flex justify-center cursor-pointer">
    <button
      class="bg-custom-gray p-6 hover:bg-gray-700 grow"
      @click="() => router.push('/')"
      :disabled="uiStore.isLoading"
    >
      {{ $t('Navbar.Chat') }}
    </button>

    <button
      class="bg-custom-gray p-6 hover:bg-gray-700 grow"
      @click="() => router.push('/profile')"
      :disabled="uiStore.isLoading"
    >
      {{ $t('Navbar.Profile') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUiStore } from '../stores/ui';

const router = useRouter();
const uiStore = useUiStore();
</script>
