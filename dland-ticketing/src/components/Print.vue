<template>
  <div class="content" role="main">
    <div style="text-align: center">
      <h1>{{ title }} app is running!</h1>
      <h2>Advanced Printing from Javascript</h2>
      <fieldset>
        <legend>Client Printer:</legend>
        <label class="checkbox">
          <input
            type="checkbox"
            id="useDefaultPrinter"
            v-model="print2default"
          />
          <strong>Print to Default printer</strong>
        </label>
        <p>or...</p>
        <Printers :printer-list="printers" @change="onPrinterChange" />
      </fieldset>
      <br />
      <br />
      <button @click="doPrintZPL">
        Print ZPL commands (Zebra printer required)...</button
      >&nbsp; <strong>OR</strong>&nbsp;
      <button @click="doPrintPDF">Print PDF...</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Printers from "./Printers.vue";
import * as JSPM from "jsprintmanager";

// Props
const props = defineProps({
  title: String,
});

// Reactive state
const print2default = ref(false);
const printers = ref([]);
const selectedPrinter = ref("");

const doPrintZPL = () => {
  if (!selectedPrinter.value && !print2default.value) {
    alert("You must select a printer");
    return;
  }

  // ... rest of the printing logic
};

const doPrintPDF = () => {
  console.log("test");
  console.log(selectedPrinter.value);
  // ... rest of the printing logic
};

const onPrinterChange = (value) => {
  selectedPrinter.value = value;
  console.info("Selected printer:", value);
};

const getPrinters = async () => {
  // ... get printers logic
};

onMounted(async () => {
  JSPM.JSPrintManager.auto_reconnect = true;
  JSPM.JSPrintManager.start();

  JSPM.JSPrintManager.WS.onStatusChanged = async () => {
    const p = await getPrinters();
    printers.value = p;
  };
});
</script>

<style scoped>
/* ... your scoped styles ... */
</style>
