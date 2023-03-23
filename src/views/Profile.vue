<template>
  <section class="flex flex-col gap-8 p-4 pb-20">
    <div class="rounded-full bg-[#3B3B3B] w-48 h-48 mx-auto"></div>

    <div>
      <div>Your Name</div>
      <div class="flex justify-between">
        <div>{{ name }}</div>
        <div>Edit</div>
      </div>
    </div>

    <div>
      <div>Your Email</div>
      <div class="flex justify-between">
        <div>{{ email }}</div>
        <div>Edit</div>
      </div>
    </div>

    <div class="flex">
      <button
        class="bg-white p-2 text-black font-bold rounded grow"
        @click="logout({ router, cookies, userStore })"
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
    <DeleteModal :show="showDeleteModal" @close-modal="closeDeleteModal" @logout="logout({ router, cookies, userStore })" />
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCookies } from 'vue3-cookies';
import { useRouter } from 'vue-router';

import { logout } from '../utils/api';
import Navbar from '../components/Navbar.vue';
import DeleteModal from '../components/DeleteModal.vue'
import { useUserStore } from '../stores/user';

const { cookies } = useCookies()
const router = useRouter()
const userStore = useUserStore()

const name = computed(() => userStore.name)
const email = computed(() => userStore.email)
const showDeleteModal = ref(false)

const openDeleteModal = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}
</script>
