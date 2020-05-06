<script lang="ts">
import { defineComponent } from 'vue';
import Home from './views/Home.vue';
import './assets/css/tailwind.css';

export default defineComponent({
  name: 'App',
  components: { Home }
});
</script>

<template>
  <Home />
</template>
