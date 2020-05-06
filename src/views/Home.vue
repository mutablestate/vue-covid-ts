<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Home',

  setup() {
    const store = useStore();
    return { store };
  }
});
</script>

<template>
  <div>
    <img src="../assets/logo.png" />
    <h1>Hello Vue 3!</h1>
    <button @click="store.commit('increment')">
      Clicked {{ store.state.count }} times.
    </button>
  </div>
</template>

<style scoped>
img {
  width: 200px;
}
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
