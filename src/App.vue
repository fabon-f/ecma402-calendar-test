<script setup lang="ts">
import { wrap } from "comlink";
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { test as testFunc } from "./calendar_test";
import TestWorker from "./worker.ts?worker";

const test = wrap<typeof testFunc>(new TestWorker());

const isTemporalSupported = 'Temporal' in globalThis;
const usePolyfill = ref(!isTemporalSupported);

const { state, executeImmediate, isReady, isLoading } = useAsyncState(test, [], { immediate: false });

async function handleButtonClick() {
  await executeImmediate(usePolyfill.value);
}
</script>

<template>
  <div class="wrapper">
    <div>
      <h1>ECMA-402 calendar test</h1>
      spec: <a href="https://tc39.es/proposal-intl-era-monthcode/">Intl era and monthCode Proposal</a>
    </div>

    <div class="config">
      <label><input type="checkbox" v-model="usePolyfill" :disabled="!isTemporalSupported || isLoading" />Use polyfill (based on <code>Intl.DateTimeFormat</code>)</label>
      <button type="button" :disabled="isLoading" @click="handleButtonClick">Run</button>
    </div>

    <div v-if="isReady">
      <div v-for="result in state" :key="result.calendar">
        {{ result.calendar }}:
        <ul>
          <li v-for="date in result.dates" :key="date[0]"><code>{{ date[0] }}</code></li>
        </ul>
      </div>
    </div>
    <div v-else-if="isLoading">
      Running tests...
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  padding: 1rem;
  font-family: sans-serif;
}

.wrapper > * + * {
  margin-block-start: 2rem;
}

.config {
  display: flex;
  gap: 2rem;
}
</style>
