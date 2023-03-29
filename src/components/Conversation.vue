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

    <div ref="conversationDiv" class="bg-custom-gray grow flex flex-col gap-2 p-2 overflow-auto">
      <div
        v-for="{ message, userId } in messages"
        class="p-2 rounded-xl"
        :class="userId !== userStore.id ? 'bg-black mr-auto' : 'bg-white text-black ml-auto'"
      >
        {{ message }}
      </div>
    </div>

    <form
      class="bg-black p-4 flex items-center gap-4"
      @submit="sendMessage"
    >
      <input 
        class="grow rounded-md p-2"
        ref="messageInput"
        type="text"
        placeholder="Enter a message"
      >
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
import { socket } from '../socket';
import { useConversationStore } from '../stores/conversation';
import { useUserStore } from '../stores/user';
import { createMessage } from '../apis/message'
import { createConversation } from '../apis/conversation'
import { createUserConversation } from '../apis/conversation';

const userStore = useUserStore()
const conversationStore = useConversationStore()
const { recipients, id } = defineProps(['recipients', 'id'])
const emits = defineEmits(['onClose'])
const messageInput = ref<any>(null)
const conversationDiv = ref<any>(null)
const conversationId = ref<any>(id)
const conversationTitle = computed(() => {
  let title = ''

  if (!recipients) return title

  recipients.forEach((user: any, index: number) => {
    title += user.name

    if (index !== recipients.length - 1) title += ', '
  })

  return title
})
const messages = computed(() => conversationStore.getConversationMessages(conversationId.value))

onMounted(() => {
  document.body.style.overflow = 'hidden'
  conversationDiv.value.scrollTop = conversationDiv.value.scrollHeight
  messageInput.value.focus()
})

onUpdated(() => {
  conversationDiv.value.scrollTop = conversationDiv.value.scrollHeight
})

onUnmounted(() => {
  document.body.style.overflow = 'auto'
})

const sendMessage = async (e: any) => {
  e.preventDefault()

  const message = messageInput.value.value
  const conversationName = recipients.map((user: any, i: number) => i ? ` ${user.name}` : user.name).toString()

  for (let recipient of recipients) {
    if (!conversationId.value) {
      const { conversation } = await createConversation({
        name: conversationName
      })
      
      // TODO: adjust this after implementing group chat
      conversationId.value = conversation?.id
    }

    const { success: isCreateUserConversationSuccess } = await createUserConversation({ userId: userStore.id, conversationId: conversationId.value })
    if (!isCreateUserConversationSuccess) return
    
    const { success: isCreateMessageSuccess } = await createMessage({ conversationId: conversationId.value, userId: userStore.id, message })
    if (!isCreateMessageSuccess) return
    
    const to = recipient.users.find((user: any) => user.id !== userStore.id).email
    socket.emit('sendMessage', { message, to, conversationId: conversationId.value })

    conversationStore.updateData({
      conversationId: conversationId.value,
      userId: userStore.id,
      name: conversationName,
      users: recipient.users,
      messages: null,
      message
    })
  }

  messageInput.value.value = ''
}
</script>
