<template>
  <section class="flex flex-col gap-8 h-screen">
    <div class="flex flex-col gap-8 p-4 h-screen">
      <div class="rounded-full bg-[#3B3B3B] w-48 h-48 mx-auto"></div>

      <div class="flex flex-col gap-2">
        <div>
          <div class="p-2 font-bold">Name</div>
          <div
            v-if="isEditMode"
            class="flex justify-between items-center gap-4"
          >
            <input
              ref="nameInput"
              class="grow p-2 rounded"
              type="text"
              name="name"
              id="name"
              :value="name"
              autocomplete="off"
            />
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="disableEditMode"
            >
              &times;
            </div>
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="onUpdateUser"
            >
              &check;
            </div>
          </div>
          <div v-else class="flex justify-between items-center gap-4">
            <div class="p-2">{{ name }}</div>
            <div
              class="cursor-pointer font-bold text-2xl"
              @click="activateEditMode"
            >
              &#9998;
            </div>
          </div>
        </div>

        <div>
          <div class="p-2 font-bold">Email</div>
          <div class="flex justify-between p-2">
            <div>{{ email }}</div>
          </div>
        </div>
      </div>

      <div class="flex">
        <button
          class="bg-white p-2 text-black font-bold rounded grow"
          @click="() => logout(router)"
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
    </div>

    <Navbar />
  </section>

  <UserDeleteModal
    :show="showDeleteModal"
    @close-modal="closeDeleteModal"
    @logout="() => logout(router)"
  />
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { logout, updateUser } from '../apis/user';
import { useUserStore } from '../stores/user';
import { TimeoutId } from '../types';
import Navbar from '../components/Navbar.vue';
import UserDeleteModal from '../components/UserDeleteModal.vue';

const router = useRouter();
const userStore = useUserStore();
const name = computed(() => userStore.name);
const email = computed(() => userStore.email);
const showDeleteModal = ref(false);
const nameInput = ref<HTMLInputElement | null>(null);
const isEditMode = ref(false);
const timeoutIds: TimeoutId[] = [];

onUnmounted(() => {
  timeoutIds.forEach((id: TimeoutId) => clearTimeout(id));
});

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const activateEditMode = () => {
  isEditMode.value = true;
  timeoutIds.push(setTimeout(() => nameInput.value?.focus(), 1));
};

const disableEditMode = () => {
  isEditMode.value = false;
};

const onUpdateUser = async () => {
  disableEditMode();

  if (!nameInput.value || nameInput.value.value.trim() === userStore.name)
    return;

  const { success, user } = await updateUser(
    userStore.id,
    nameInput.value.value
  );
  if (!success) {
    logout(router);
    return;
  }

  userStore.setUser(user.id, user.name, user.email);
};
</script>
