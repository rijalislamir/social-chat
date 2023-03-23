<template>
  <section class="flex flex-col gap-8 p-4 pb-20">
    <div class="rounded-full bg-[#3B3B3B] w-48 h-48 mx-auto"></div>

    <div>
      <div>Your Name</div>
      <div class="flex justify-between">
        <div>Name</div>
        <div>Edit</div>
      </div>
    </div>

    <div>
      <div>Your Email</div>
      <div class="flex justify-between">
        <div>Email</div>
        <div>Edit</div>
      </div>
    </div>

    <div class="flex">
      <button
        class="bg-white p-2 text-black font-bold rounded grow"
        @click="logout({ router, cookies })"
      >
        Logout
      </button>
    </div>

    <div class="flex">
      <button
        class="bg-red-600 p-2 text-white font-bold rounded grow"
        @click="openDeleteModal"
      >
        Delete Account
      </button>
    </div>

    <Navbar />
    <DeleteModal :show="showDeleteModal" @close-modal="closeDeleteModal" @logout="logout" />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';
import { logout } from '../utils/api';

import Navbar from '../components/Navbar.vue';
import DeleteModal from '../components/DeleteModal.vue'

const { cookies } = useCookies()
const router = useRouter()

const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}
</script>
