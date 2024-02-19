<template>
  <div id="installedPrinters">
    <label for="installedPrinterName">Select an installed Printer: </label>
    <select name="printer" id="printer" v-model="selectedPrinter">
      <option disabled value="">Select printer</option>
      <option v-for="printer in printerList" :key="printer">
        {{ printer }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  printerList: Array,
});

const selectedPrinter = ref("");

defineEmits(["change"]);

watch(selectedPrinter, (value) => {
  emit("change", value);
});
</script>
