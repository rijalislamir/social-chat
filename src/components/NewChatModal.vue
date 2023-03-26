<template>
  <!-- NEW CHAT MODAL -->
  <div
    class="fixed inset-0 flex bg-black/90 flex-col justify-between"
    v-if="show"
  >
    <div class="flex flex-col h-screen">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">Online Users</div>
        <div
          class="absolute p-4 right-0 top-0 text-xl font-bold"
          @click="() => emits('onClose')"
        >
          &times;
        </div>
      </div>

      <div class="overflow-auto grow">
        <!-- TODO: better not use v-show to exclude unnecessary users to DOM -->
        <div 
          v-for="{ name, email, isSelected } in users"
          v-show="onlineUsers.includes(email)" 
          @click="() => {
            toggleSelectedUser(email)
            startConversation()
          }"
          class="flex py-2 gap-2 px-4"
          :class="isSelected ? 'bg-blue-500' : ''"
        >
          <div class="rounded-full bg-custom-gray w-12 h-12"></div>
          <div class="flex flex-col justify-around">
            <div>
              <span>{{ name }}</span>
              <span v-if="onlineUsers.includes(email)" class="text-green-500 text-xs"> (online)</span>
              <span v-if="email === userStore.email" class="text-white text-xs"> (yourself)</span>
            </div>
            <div class="text-xs">{{ email }}</div>
          </div>
        </div>
      </div>

      <!-- TODO: show start conversation button when implementing group chat -->
      <div
        v-show="false"
        class="flex justify-center p-6 text-xl font-semibold bg-blue-800"
        @click="startConversation"
      >
        Start Conversation
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getAllUsers } from '../utils/api';
import { useUserStore } from '../stores/user';

defineProps(['show', 'onlineUsers'])
const emits = defineEmits(['onClose', 'openConversation'])
const router = useRouter()
const userStore = useUserStore()
const users = ref<any>([])
const selectedUsers = computed(() => users.value.filter((user: any) => user.isSelected))

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

const startConversation = () => {
  emits('openConversation', selectedUsers.value)
  emits('onClose')
}
</script>
