<template>
  <div
    v-if="show"
    @click.self="emits('closeModal')" 
    class="fixed inset-0 bg-black/90 z-10 p-4 flex flex-col justify-center cursor-pointer"
  >
    <div class="bg-[#3B3B3B] flex flex-col rounded-xl overflow-hidden cursor-default">
      <p class="p-4 text-center">Are you sure want to delete the account?</p>

      <div class="flex">
        <button @click="emits('closeModal')" class="border-0 grow font-semibold py-4 text-sm bg-white text-black">Cancel</button>
        <button @click="onDeleteUser" class="border-0 grow font-semibold py-4 text-sm bg-red-600">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteUser } from '../apis/user'
import { deleteUserMessages } from '../apis/message'
import { deleteUserConversations } from '../apis/conversation'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

defineProps(['show'])
const emits = defineEmits(['closeModal', 'logout'])

const onDeleteUser = async () => {
  if (!userStore?.id) return;

  const { success } = await deleteUserMessages({ userId: userStore.id })
  if (!success) return

  const { success: successDeleteConversation } = await deleteUserConversations({ userId: userStore.id })
  if (!successDeleteConversation) return

  const { success: isDeleteUserSuccess, id } = await deleteUser({ id: userStore.id })
  if (isDeleteUserSuccess && id === userStore.id) emits('logout')
}
</script>
