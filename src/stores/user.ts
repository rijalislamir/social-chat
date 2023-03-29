import { ref } from 'vue';
import { defineStore } from 'pinia';
import { OnlineUser } from '../types';

export const useUserStore = defineStore('user', () => {
  const id = ref('');
  const name = ref('');
  const email = ref('');

  const onlineUsers = ref<OnlineUser[]>([]);

  const setUser = ({
    newId,
    newName,
    newEmail,
  }: {
    newId: string;
    newName: string;
    newEmail: string;
  }) => {
    id.value = newId;
    name.value = newName;
    email.value = newEmail;
  };

  const resetUser = () => {
    id.value = '';
    name.value = '';
    email.value = '';
  };

  return { id, name, email, onlineUsers, setUser, resetUser };
});
