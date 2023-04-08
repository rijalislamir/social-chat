<template>
  <!-- NEW CHAT MODAL -->
  <div class="fixed inset-0 flex bg-black/90 flex-col justify-between">
    <div class="flex flex-col h-screen">
      <div class="relative p-4">
        <div class="text-center text-xl font-semibold">
          {{ $t('NewChat.Title') }}
        </div>
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
          <span class="text-4xl font-semibold">{{
            $t('NewChat.EmptyOnlineUsersFirst')
          }}</span>
          <span>{{ $t('NewChat.EmptyOnlineUsersSecond') }}</span>
        </div>

        <!-- TODO: better not use v-show to exclude unnecessary users to DOM -->
        <div
          v-else
          v-for="({ userId, name, email, self }, i) in userStore.onlineUsers"
          :key="`online-user-${i}`"
          v-show="!self"
          @click="
            () => {
              toggleSelectedUser(userId, name, email);
            }
          "
          class="flex py-2 gap-2 px-4 cursor-pointer"
          :class="
            checkSelectedUser(userId)
              ? 'bg-blue-500 hover:bg-blue-700'
              : 'hover:bg-gray-700'
          "
        >
          <div class="rounded-full bg-custom-gray w-12 h-12"></div>
          <div class="flex flex-col justify-around">
            <span>{{ name }}</span>
            <span class="text-xs">{{ email }}</span>
          </div>
        </div>
      </div>

      <button
        v-if="anyOnlineUsers"
        class="flex justify-center p-6 text-xl font-semibold bg-blue-800"
        :class="!selectedUser.length ? 'cursor-not-allowed opacity-50' : ''"
        @click="startConversation"
        :disabled="!selectedUser.length"
      >
        Start Conversation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useConversationStore } from '../stores/conversation';
import { User, OnlineUser } from '../types';

const emits = defineEmits(['onClose', 'openConversation']);
const userStore = useUserStore();
const conversationStore = useConversationStore();
const selectedUser = ref<User[]>([
  { id: userStore.id, name: userStore.name, email: userStore.email },
]);
const anyOnlineUsers = computed(() =>
  userStore.onlineUsers.some((user: OnlineUser) => !user.self)
);

onMounted(async () => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});

const toggleSelectedUser = (id: string, name: string, email: string) => {
  const isSelected = selectedUser.value.some((user: User) => id === user.id);

  if (isSelected) {
    selectedUser.value = selectedUser.value.filter(
      (user: User) => user.id !== id
    );
  } else {
    selectedUser.value.push({ id, name, email });
  }
};

const startConversation = () => {
  let id = '';

  for (const conversationId in conversationStore.data) {
    if (
      conversationStore.data[conversationId].users.length !==
      selectedUser.value.length
    )
      continue;

    selectedUser.value.some((b: User, i: number) => {
      const found = conversationStore.data[conversationId].users.some(
        (user: User) => b.id === user.id
      );

      if (!found) return true; // to exit "some" method
      if (i === selectedUser.value.length - 1) id = conversationId;

      return false;
    });

    if (id) {
      break;
    }
  }

  emits('openConversation', id, selectedUser.value);
  emits('onClose');
};

const checkSelectedUser = (id: string) => {
  return selectedUser.value.some((user: User) => id === user.id);
};
</script>
