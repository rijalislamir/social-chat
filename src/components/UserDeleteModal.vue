<template>
  <div
    v-if="show"
    @click.self="emits('closeModal')" 
    class="fixed inset-0 bg-black/90 z-10 p-4 flex flex-col justify-center"
  >
    <div class="bg-[#3B3B3B] flex flex-col rounded-xl overflow-hidden">
      <p class="p-4 text-center">Are you sure want to delete the account?</p>

      <div class="flex">
        <button @click="emits('closeModal')" class="border-0 grow font-semibold py-4 text-sm bg-white text-black">Cancel</button>
        <button @click="onDeleteUser" class="border-0 grow font-semibold py-4 text-sm bg-red-600">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCookies } from 'vue3-cookies';
import { deleteUser } from '../utils/api'
import { useUserStore } from '../stores/user';

const { cookies } = useCookies()
const userStore = useUserStore()

defineProps(['show'])
const emits = defineEmits(['closeModal', 'logout'])

const onDeleteUser = async () => {
  if (!userStore?.id) return;

  try {
    const token = cookies.get('accesstoken')
    const res = await deleteUser({
      id: userStore.id,
      token
    })

    if (res.success && res?.id === userStore.id) emits('logout')
  } catch (error) {
    console.log(error)
  }
}
</script>