<template>
  <q-popup-edit v-model="props.model" v-slot="scope" persistent @save="$emit('update')">
    <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
    <div class="float-right">
      <q-btn size="sm" color="red-9" flat icon="close" @click="scope.cancel" />
      <q-btn size="sm" color="green-9" flat icon="check" @click="scope.set" />
    </div>
  </q-popup-edit>
</template>

<script setup>
const props = defineProps({
  model: String
})

const emits = defineEmits(["update"])


</script>
