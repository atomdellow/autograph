<template>
  <div class="app-container">
    <GraphEditor />
  </div>
</template>

<script setup>
import GraphEditor from './components/GraphEditor.vue'
</script>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
