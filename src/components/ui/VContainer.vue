<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VContainer",
});
</script>

<template>
  <div class="container">
    <slot />
  </div>
</template>
