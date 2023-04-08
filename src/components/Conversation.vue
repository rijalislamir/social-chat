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
        {{ conversationName }}
      </div>
    </div>

    <div
      ref="conversationDiv"
      class="bg-custom-gray grow flex flex-col gap-2 p-2 overflow-y-auto"
    >
      <div
        v-for="({ message, userId, createdAt }, i) in messages"
        :key="`message-${i}`"
        class="p-2 rounded-xl flex gap-2 items-end"
        :class="
          userId !== userStore.id
            ? 'bg-black mr-auto'
            : 'bg-white text-black ml-auto'
        "
      >
        <span id="message">{{ message }}</span>
        <span class="text-xs">{{ moment(createdAt).format('HH:mm') }}</span>
      </div>
    </div>

    <form class="bg-black p-4 flex items-center gap-4" @submit="sendMessage">
      <input
        class="grow rounded-md p-2 outline-white"
        :class="{ 'bg-red-400': isReachMaxLength }"
        @input="onChangeMessageInput"
        ref="messageInput"
        type="text"
        placeholder="Enter a message"
        maxlength="256"
      />
      <button
        class="text-2xl font-bold rounded-full w-10 h-10 bg-custom-gray flex items-center justify-center disabled:opacity-50"
        :class="{ 'cursor-not-allowed': isReachMaxLength }"
        type="submit"
        :disabled="isReachMaxLength"
      >
        &rightarrow;
      </button>
    </form>
  </div>
</template>

<style scoped>
#message {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-all;
  word-break: break-word;
}
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue';
import { socket } from '../utils/socket';
import { useConversationStore } from '../stores/conversation';
import { useUserStore } from '../stores/user';
import { createMessage } from '../apis/message';
import { createConversation } from '../apis/conversation';
import { createUserConversation } from '../apis/conversation';
import { User } from '../types';
import { getConversationName } from '../utils';
import moment from 'moment';

const userStore = useUserStore();
const conversationStore = useConversationStore();
const props = defineProps(['recipients', 'id']);
const emits = defineEmits(['onClose']);
const messageInput = ref<HTMLInputElement | null>(null);
const conversationDiv = ref<HTMLDivElement | null>(null);
const conversationId = ref<string>(props.id);
const conversationName = getConversationName(
  '',
  userStore.id,
  props.recipients
);
const isReachMaxLength = ref<boolean>(false);
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

  let isSent = false; // Needed to make sure message have been stored before reached recipients
  const message = messageInput.value?.value || '';
  const conversationName = props.recipients
    .map((user: User, i: number) => (i ? ` ${user.name}` : user.name))
    .toString();

  for (const recipient of props.recipients) {
    if (recipient.id === userStore.id) continue;

    if (!conversationId.value) {
      const { conversation } = await createConversation(conversationName);

      // TODO: adjust this after implementing group chat
      conversationId.value = conversation?.id;
    }

    const { success: isCreateUserConversationSuccess } =
      await createUserConversation(userStore.id, conversationId.value);
    if (!isCreateUserConversationSuccess) return;

    if (!isSent) {
      const { success: isCreateMessageSuccess } = await createMessage(
        conversationId.value,
        userStore.id,
        message
      );
      if (!isCreateMessageSuccess) return;

      conversationStore.updateData(
        {
          conversationId: conversationId.value,
          userId: userStore.id,
          name: conversationName,
          users: props.recipients,
          messages: null,
          message,
        },
        userStore
      );

      isSent = true;
    }

    socket.emit('sendMessage', {
      message,
      to: recipient.id,
      conversationId: conversationId.value,
      users: props.recipients,
    });
  }

  if (messageInput.value) messageInput.value.value = '';
};

const onChangeMessageInput = () => {
  if (messageInput.value?.value.length === 256) isReachMaxLength.value = true;
  else isReachMaxLength.value = false;
};
</script>
