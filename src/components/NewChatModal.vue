<template>
  <!-- NEW CHAT MODAL -->
  <div class="fixed inset-0 flex bg-black/90 flex-col justify-between">
    <div class="flex flex-col h-screen">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">Online Users</div>
        <div class="absolute p-4 right-0 top-0">
          <span
            @click="() => emits('onClose')"
            class="text-xl font-bold cursor-pointer"
          >
            &times;
          </span>
        </div>
      </div>

      <div class="overflow-auto grow">
        <div
          v-if="!anyOnlineUsers"
          class="flex flex-col justify-center items-center h-full"
        >
          <span class="text-4xl font-semibold"> No online user </span>
          <span> (invite your friends) </span>
        </div>

        <!-- TODO: better not use v-show to exclude unnecessary users to DOM -->
        <div
          v-else
          v-for="(
            { name, email, self, isSelected }, i
          ) in userStore.onlineUsers"
          :key="`online-user-${i}`"
          v-show="!self"
          @click="
            () => {
              toggleSelectedUser(email);
              startConversation();
            }
          "
          class="flex py-2 gap-2 px-4 cursor-pointer hover:bg-gray-700"
          :class="isSelected ? 'bg-blue-500 hover:bg-blue-500' : ''"
        >
          <div class="rounded-full bg-custom-gray w-12 h-12"></div>
          <div class="flex flex-col justify-around">
            <span>{{ name }}</span>
            <span class="text-xs">{{ email }}</span>
          </div>
        </div>
      </div>

      <!-- TODO: show start conversation button when implementing group chat -->
      <button
        v-if="false"
        class="flex justify-center p-6 text-xl font-semibold bg-blue-800"
        :class="!selectedUsers.length ? 'cursor-not-allowed opacity-50' : ''"
        @click="startConversation"
        :disabled="!selectedUsers.length"
      >
        Start Conversation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../stores/user';
import { OnlineUser } from '../types';

const emits = defineEmits(['onClose', 'openConversation']);
const userStore = useUserStore();
const selectedUsers = computed(() =>
  userStore.onlineUsers.filter((user: OnlineUser) => user.isSelected)
);
const anyOnlineUsers = computed(() =>
  userStore.onlineUsers.some((user: OnlineUser) => !user.self)
);

onMounted(async () => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});

const toggleSelectedUser = (email: string) => {
  const index = userStore.onlineUsers.findIndex(
    (user: OnlineUser) => email === user.email
  );
  userStore.onlineUsers[index].isSelected =
    !userStore.onlineUsers[index]?.isSelected;
};

const startConversation = () => {
  emits('openConversation', '', selectedUsers.value);
  emits('onClose');

  selectedUsers.value.forEach((user: OnlineUser) => {
    if (user.isSelected) user.isSelected = false;
  });
};
</script>
