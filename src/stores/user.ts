import { ref } from 'vue';
import { defineStore } from 'pinia';
import { OnlineUser } from '../types';

export const useUserStore = defineStore('user', () => {
  const id = ref('');
  const name = ref('');
  const email = ref('');
  const profilePicture = ref('');

  const onlineUsers = ref<OnlineUser[]>([]);

  const setUser = (
    newId: string,
    newName: string,
    newEmail: string,
    newProfilePicture: string
  ) => {
    id.value = newId;
    name.value = newName;
    email.value = newEmail;
    profilePicture.value = newProfilePicture || profilePicture.value;
  };

  const resetUser = () => {
    id.value = '';
    name.value = '';
    email.value = '';
    profilePicture.value = '';
  };

  return { id, name, email, profilePicture, onlineUsers, setUser, resetUser };
});
