<template>
  <!-- NEW CHAT MODAL -->
  <div
    class="fixed inset-0 flex bg-black/90 flex-col justify-between"
  >
    <div class="flex flex-col h-screen">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">Registered User</div>
        <div
          class="absolute p-4 right-0 top-0 text-xl font-bold"
          @click="() => emits('onClose')"
        >
          &times;
        </div>
      </div>

      <div class="overflow-auto grow">
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

      <div class="flex justify-center p-6 text-xl font-semibold bg-blue-800">Start Conversation</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getAllUsers } from '../utils/api';
import { useUserStore } from '../stores/user';

const emits = defineEmits(['onClose'])
const router = useRouter()
const userStore = useUserStore()
const users = ref<any>([])

onMounted(async () => {
  document.body.style.overflow = 'hidden'

  const res = await getAllUsers()

  if (!res.success) {
    logout({ router, userStore })
    return
  }

  users.value = res.users
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const toggleSelectedUser = ( email: string ) => {
  const index = users.value.findIndex((user: any) => email === user.email)
  users.value[index].isSelected = !users.value[index].isSelected    
}
</script>
