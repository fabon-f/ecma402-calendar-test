<script setup lang="ts">
import { wrap } from "comlink";
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { test as testFunc } from "./calendar_test";
import TestWorker from "./worker.ts?worker";

const test = wrap<typeof testFunc>(new TestWorker());

const isTemporalSupported = 'Temporal' in globalThis;
const target = ref<"temporal" | "intl">(isTemporalSupported ? "temporal" : "intl");

const { state, executeImmediate, isReady, isLoading } = useAsyncState(test, [], { immediate: false });

async function handleButtonClick() {
  await executeImmediate(target.value === "intl");
}
</script>

<template>
  <div class="wrapper">
    <div>
      <h1>ECMA-402 calendar test</h1>
      spec: <a href="https://tc39.es/proposal-intl-era-monthcode/">Intl era and monthCode Proposal</a>
    </div>

    <div class="config">
      <label>
        Test target:
        <select v-model="target" :disabled="isLoading" class="target">
          <option value="temporal" :disabled="!isTemporalSupported">Temporal{{ isTemporalSupported ? "" : " (not supported)" }}</option>
          <option value="intl">Intl.DateTimeFormat</option>
        </select>
      </label>
      <button type="button" :disabled="isLoading" @click="handleButtonClick">Run tests</button>
    </div>

    <div v-if="isReady" class="result">
      <h2>Test result</h2>
      <div>list of dates with a discrepancy between spec and implementation for each calendar</div>
      <div v-for="result in state" :key="result.calendar" class="result-calendar">
        <div><code>&quot;{{ result.calendar }}&quot;</code>:</div>
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
  flex-wrap: wrap;
  gap: 1rem 2rem;
}

.target {
  font-family: monospace;
}

.result > * + * {
  margin-block-start: 2rem;
}

:where(.result ul) {
  margin-block: 0;
}

.result-calendar > * + * {
  margin-block-start: 0.5rem;
}
</style>
