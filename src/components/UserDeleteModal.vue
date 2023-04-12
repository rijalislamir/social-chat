<template>
  <div
    v-if="show"
    @click.self="() => emits('closeModal')"
    class="fixed inset-0 bg-black/90 z-10 p-4 flex flex-col justify-center cursor-pointer"
  >
    <div
      class="bg-[#3B3B3B] flex flex-col rounded-xl overflow-hidden cursor-default"
    >
      <p
        v-if="uiStore.isLoading"
        class="p-4 text-center flex gap-4 justify-center"
      >
        <span>{{ $t('DeleteAccount.Deleting') }}</span>
        <MoonLoader
          :loading="uiStore.isLoading"
          :color="'#ffffff'"
          :size="'24px'"
        />
      </p>
      <p v-else class="p-4 text-center">{{ $t('DeleteAccount.Text') }}</p>

      <div class="flex">
        <button
          @click="() => emits('closeModal')"
          class="border-0 disabled:opacity-50 grow font-semibold py-4 text-sm bg-white text-black"
          :disabled="uiStore.isLoading"
        >
          {{ $t('DeleteAccount.Cancel') }}
        </button>
        <button
          @click="onDeleteUser"
          class="border-0 disabled:opacity-50 grow font-semibold py-4 text-sm bg-red-600"
          :disabled="uiStore.isLoading"
        >
          {{ $t('DeleteAccount.Confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { deleteUser } from '../apis/user';
import { deleteUserMessages } from '../apis/message';
import { deleteUserConversations } from '../apis/conversation';
import { useUserStore } from '../stores/user';
import { useUiStore } from '../stores/ui';
import { MoonLoader } from 'vue3-spinner';

const userStore = useUserStore();
const uiStore = useUiStore();

defineProps(['show']);
const emits = defineEmits(['closeModal', 'logout']);

const onDeleteUser = async () => {
  uiStore.isLoading = true;

  if (!userStore?.id) {
    uiStore.isLoading = false;
    return;
  }

  const { success } = await deleteUserMessages(userStore.id);
  if (!success) {
    uiStore.isLoading = false;
    return;
  }

  const { success: successDeleteConversation } = await deleteUserConversations(
    userStore.id
  );
  if (!successDeleteConversation) {
    uiStore.isLoading = false;
    return;
  }

  const { success: isDeleteUserSuccess, id } = await deleteUser(userStore.id);
  if (isDeleteUserSuccess && id === userStore.id) emits('logout');
};
</script>
