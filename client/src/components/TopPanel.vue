<template>
  <!-- <div class="full-width"> -->
  <q-card
    class="flex items-center justify-between bg-transparent"
    :style="{ height: props.height }"
  >
    <div
      class="text-subtitle2 text-weight-bolder text-white text-start q-px-md"
    >
      <!-- Depok Fantasy Land -->
      <q-img
        src="~/assets/logo-dland.png"
        :width="$q.platform.is.desktop ? '250px' : '100px'"
        spinner-color="primary"
        spinner-size="20px"
      />
    </div>
    <div class="text-body text-weight-bolder text-white text-start q-px-md">
      Administrator | Shift 1 |
      <!-- <Clock /> -->
    </div>
  </q-card>
  <!-- </div> -->
</template>

<script setup>
import Clock from "src/components/Clock.vue";
const props = defineProps({
  height: {
    type: String,
    default: "5vh",
  },
});
</script>
