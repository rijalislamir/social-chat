<template>
  <div class="flex gap-4 w-full justify-center border-t-2 p-4 mt-auto">
    <button
      v-for="(label, key, i) in LocaleLabels"
      @click="
        () => {
          $i18n.locale = key as string;
          storeLanguage(key as string);
        }
      "
      :class="{ 'font-bold': $i18n.locale === key }"
      :key="`languange-${i}`"
    >
      {{ label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { LocaleLabels } from '../locales';

const storeLanguage = (code: string) => {
  localStorage.setItem('language', code);
};
</script>
