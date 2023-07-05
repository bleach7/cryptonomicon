<script lang="ts">
import { defineComponent } from "vue";
import LoaderIcon from "../../assets/imgs/icons/LoaderIcon.vue";

export default defineComponent({
  name: "VPagePreloader",
  components: {
    LoaderIcon,
  },
});
</script>

<template>
  <section
    class="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-purple-800 opacity-80"
  >
    <LoaderIcon class="-ml-1 mr-3 h-12 w-12 text-white" />
  </section>
</template>
