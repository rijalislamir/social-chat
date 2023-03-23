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
import jwtDecode from 'jwt-decode'
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';

import { deleteUser } from '../utils/api'

const { cookies } = useCookies()
const router = useRouter()

defineProps(['show'])
const emits = defineEmits(['closeModal', 'logout'])

const onDeleteUser = async () => {
  const token = cookies.get('accesstoken')
  const decodedToken: {
    email: string,
    exp: number,
    iat: number,
    id: string,
    name: string
  } = jwtDecode(token)

  if (decodedToken?.id) {
    try {
      const res = await deleteUser({
        id: decodedToken.id,
        token
      })

      if (res.status === 'success' && res?.id === decodedToken.id) {
        emits('logout')
      } 
    } catch (error) {
      console.log(error)
    }
  }
}
</script>