<template>
  <!-- NEW CHAT MODAL -->
  <div
    class="fixed inset-0 flex bg-black/90"
  >
    <div class="flex flex-col grow">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">Registered User</div>
        <div
          class="absolute p-4 right-0 top-0 text-xl font-bold"
          @click="() => emits('onClose')"
        >
          &times;
        </div>
      </div>

      <div class="overflow-auto">
        <div 
          v-for="{ name, email, isSelected } in users"
          @click="() => toggleSelectedUser(email)"
          class="flex py-2 gap-2 px-4"
          :class="isSelected ? 'bg-blue-500' : ''"
          >
          <div class="rounded-full bg-custom-gray w-12 h-12"></div>
          <div class="flex flex-col justify-around">
            <div>{{ name }}</div>
            <div class="text-xs">{{ email }}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-center p-4 bg-blue-800">Start Conversation</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const emits = defineEmits(['onClose'])

const users = ref<any>([
  {
    name: 'Andi',
    email: 'andi@gmail.com',
    isSelected: false
  },
  {
    name: 'Budi',
    email: 'budi@gmail.com',
    isSelected: false
  },
  {
    name: 'Rijal',
    email: 'rijal@gmail.com',
    isSelected: false
  },
  {
    name: 'Andi 2',
    email: 'andi2@gmail.com',
    isSelected: false
  },
  {
    name: 'Budi 2',
    email: 'budi2@gmail.com',
    isSelected: false
  },
  {
    name: 'Rijal 2',
    email: 'rijal2@gmail.com',
    isSelected: false
  },
  {
    name: 'Andi 3',
    email: 'andi3@gmail.com',
    isSelected: false
  },
  {
    name: 'Budi 3',
    email: 'budi3@gmail.com',
    isSelected: false
  },
  {
    name: 'Rijal 3',
    email: 'rijal3@gmail.com',
    isSelected: false
  },
  {
    name: 'Andi 4',
    email: 'andi4@gmail.com',
    isSelected: false
  },
  {
    name: 'Budi 4',
    email: 'budi4@gmail.com',
    isSelected: false
  },
  {
    name: 'Rijal 4',
    email: 'rijal4@gmail.com',
    isSelected: false
  },
])

onMounted(() => {
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const toggleSelectedUser = ( email: string ) => {
  const index = users.value.findIndex((user: any) => email === user.email)
  users.value[index].isSelected = !users.value[index].isSelected    
}
</script>
