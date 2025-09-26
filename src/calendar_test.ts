import "temporal-spec/global";
import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";
import { dates as chineseDates } from "./calendars/chinese";
import { dates as dangiDates } from "./calendars/dangi";

export type TestData = [string, [year: number, monthCode: string, day: number]];

export function test(usePolyfill: boolean): TestData[] {
  const Temporal: typeof globalThis.Temporal = usePolyfill
    ? TemporalPolyfill
    : globalThis.Temporal;
  const testDates = [...chineseDates, ...dangiDates];
  return testDates.filter(([date, [_year, monthCode, day]]) => {
    const plainDate = Temporal.PlainDate.from(date);
    return plainDate.monthCode !== monthCode || plainDate.day !== day;
  });
}
