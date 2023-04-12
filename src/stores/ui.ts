import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const isLoading = ref(true);

  return { isLoading };
});
