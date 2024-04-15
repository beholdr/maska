<script setup lang="ts">
import { computed, ref } from 'vue'

import { VueLive } from 'vue-live'
import 'vue-live/style.css'

const props = defineProps(['examples'])

const selectedExample = ref(0)
const code = computed(() => props.examples[selectedExample.value].code)
</script>

<template>
  <div>
    <div class="demo-select">
      <label for="demo-example-select">Choose mask example:</label>
      <select v-model="selectedExample" id="demo-example-select">
        <option v-for="(example, idx) in examples" :value="idx">
          {{ example.label }}
        </option>
      </select>
    </div>
    <VueLive :code="code" />
  </div>
</template>

<style>
.demo-select {
  border: 1px solid var(--docsifytabs-border-color);
  padding: 1rem var(--docsifytabs-content-padding) 1.5rem;
  border-bottom: none;
  border-radius: 5px 5px 0 0;
}
.demo-select > label {
  display: block;
  margin-bottom: 4px;
  color: var(--search-input-placeholder-color);
}
.demo-select > select {
  width: 100%;
  padding: 7px;
  border-radius: 4px;
  color: var(--search-input-color);
  border: 1px solid var(--search-input-border-color);
  background-color: var(--search-input-background-color);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  appearance: none;
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.VueLive-container {
  border: 1px solid var(--docsifytabs-border-color);
  margin: var(--docsifytabs-margin);
  margin-top: 0;
  border-radius: 0 0 5px 5px;
}
.VueLive-container .VueLive-editor {
  padding: 2.3rem var(--docsifytabs-content-padding);
  background-color: var(--code-theme-background);
  border-radius: 0 0 0 5px;
  width: 100%;
  position: relative;
}
.VueLive-container .VueLive-editor::after {
  content: 'Сode';
  position: absolute;
  top: 0.75em;
  right: 0.75em;
  opacity: 0.6;
  color: inherit;
  font-size: var(--font-size-s);
  line-height: 1;
}
.VueLive-container .VueLive-editor .prism-editor__editor,
.VueLive-container .VueLive-editor .prism-editor__textarea {
  font-family: var(--code-font-family);
}
.VueLive-container .VueLivePreview {
  padding: 2rem var(--docsifytabs-content-padding);
  border-radius: 0 0 5px 0;
  background-color: transparent;
  position: relative;
  width: 45%;
}
.VueLive-container .VueLivePreview::after {
  content: 'Result';
  position: absolute;
  top: 0.75em;
  right: var(--docsifytabs-content-padding);
  opacity: 0.6;
  color: inherit;
  font-size: var(--font-size-s);
  line-height: 1;
}
.VueLive-container .VueLivePreview input {
  font-size: var(--modular-scale-1);
  padding: 8px 10px;
  border: 1px solid var(--search-input-border-color);
  border-radius: 4px;
  background-color: var(--search-input-background-color);
  color: var(--search-input-color);
  width: 100%;
  max-width: 100%;
}

@media screen and (max-width: 999px) {
  .VueLive-container {
    flex-direction: column;
  }
  .VueLive-container .VueLive-editor,
  .VueLive-container .VueLivePreview {
    width: 100%;
  }
}
</style>
