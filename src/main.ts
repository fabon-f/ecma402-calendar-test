import { wrap } from "comlink";
import type { test as testFunc } from "./calendar_test";
import TestWorker from "./worker.ts?worker";

const test = wrap<typeof testFunc>(new TestWorker());
console.log(await test(false));
