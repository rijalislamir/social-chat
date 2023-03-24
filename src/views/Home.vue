<template>
  <section>
    <!-- TODO: set gradient bg color -->
    <div class="sticky top-0 py-2 px-4">
      <h1 class="text-2xl font-semibold">Social Chat</h1>
      
      <div class="flex pt-4">
        <input class="p-2 rounded grow" type="search" placeholder="Search conversation">
      </div>
    </div>


    <div class="text-sm p-4 py-2">
      <div class="flex py-2 gap-4" v-for="n in 20">
        <div class="rounded-full bg-[#3B3B3B] w-12 h-12"></div>
        <div class="flex flex-col justify-around grow">
          <div class="flex justify-between">
            <span>Name</span>
            <span>time</span>
          </div>
          <div>Message clip</div>
        </div>
      </div>
    </div>

    <Navbar />
  </section>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
</script>
