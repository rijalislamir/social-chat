<template>
  <!-- CONVERSATION -->
  <div class="fixed inset-0 bg-black flex flex-col">
    <div class="flex items-center gap-4 p-4">
      <div
        class="text-4xl font-bold cursor-pointer"
        @click="() => emits('onClose')"
      >
        &leftarrow;
      </div>

      <div class="text-xl">
        {{ conversationTitle }}
      </div>
    </div>

    <div
      ref="conversationDiv"
      class="bg-custom-gray grow flex flex-col gap-2 p-2 overflow-auto"
    >
      <div
        v-for="({ message, userId }, i) in messages"
        :key="`message-${i}`"
        class="p-2 rounded-xl"
        :class="
          userId !== userStore.id
            ? 'bg-black mr-auto'
            : 'bg-white text-black ml-auto'
        "
      >
        {{ message }}
      </div>
    </div>

    <form class="bg-black p-4 flex items-center gap-4" @submit="sendMessage">
      <input
        class="grow rounded-md p-2"
        ref="messageInput"
        type="text"
        placeholder="Enter a message"
      />
      <button
        class="text-2xl font-bold rounded-full w-10 h-10 bg-custom-gray flex items-center justify-center"
        type="submit"
      >
        &rightarrow;
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { socket } from '../utils/socket';
import { useConversationStore } from '../stores/conversation';
import { useUserStore } from '../stores/user';
import { createMessage } from '../apis/message';
import { createConversation } from '../apis/conversation';
import { createUserConversation } from '../apis/conversation';
import { User } from '../types';

const userStore = useUserStore();
const conversationStore = useConversationStore();
const props = defineProps(['recipients', 'id']);
const emits = defineEmits(['onClose']);
const messageInput = ref<HTMLInputElement | null>(null);
const conversationDiv = ref<HTMLDivElement | null>(null);
const conversationId = ref<string>(props.id);
const conversationTitle = computed(() => {
  let title = '';

  if (!props.recipients) return title;

  props.recipients.forEach((user: User, index: number) => {
    title += user.name;

    if (index !== props.recipients.length - 1) title += ', ';
  });

  return title;
});
const messages = computed(
  () => conversationStore.data[conversationId.value]?.messages
);

onMounted(() => {
  document.body.style.overflow = 'hidden';
  if (conversationDiv.value)
    conversationDiv.value.scrollTop = conversationDiv.value?.scrollHeight;
  messageInput.value?.focus();
});

onUpdated(() => {
  if (conversationDiv.value)
    conversationDiv.value.scrollTop = conversationDiv.value?.scrollHeight;
});

onUnmounted(() => {
  document.body.style.overflow = 'auto';
});

const sendMessage = async (e: Event) => {
  e.preventDefault();

  const message = messageInput.value?.value || '';
  const conversationName = props.recipients
    .map((user: User, i: number) => (i ? ` ${user.name}` : user.name))
    .toString();

  for (const recipient of props.recipients) {
    if (recipient.id === userStore.id) continue;

    if (!conversationId.value) {
      const { conversation } = await createConversation({
        name: conversationName,
      });

      // TODO: adjust this after implementing group chat
      conversationId.value = conversation?.id;
    }

    const { success: isCreateUserConversationSuccess } =
      await createUserConversation({
        userId: userStore.id,
        conversationId: conversationId.value,
      });
    if (!isCreateUserConversationSuccess) return;

    const { success: isCreateMessageSuccess } = await createMessage({
      conversationId: conversationId.value,
      userId: userStore.id,
      message,
    });
    if (!isCreateMessageSuccess) return;

    socket.emit('sendMessage', {
      message,
      to: recipient.id,
      conversationId: conversationId.value,
    });

    conversationStore.updateData({
      conversationId: conversationId.value,
      userId: userStore.id,
      name: conversationName,
      users: props.recipients,
      messages: null,
      message,
    });
  }

  if (messageInput.value) messageInput.value.value = '';
};
</script>
