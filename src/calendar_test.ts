import "temporal-spec/global";
import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";
import { testData as chineseTestData } from "./calendars/chinese";
import { testData as dangiTestData } from "./calendars/dangi";

export type CalendarDate = [string, [year: number, monthCode: string, day: number]];

export function test(usePolyfill: boolean) {
  const Temporal: typeof globalThis.Temporal = usePolyfill
    ? TemporalPolyfill
    : globalThis.Temporal;
  return [chineseTestData, dangiTestData].map((testData) => {
    const differentDates = testData.dates.filter(
      ([date, [year, monthCode, day]]) => {
        const plainDate = Temporal.PlainDate.from(date).withCalendar(
          testData.calendar,
        );
        return plainDate.year !== year || plainDate.monthCode !== monthCode || plainDate.day !== day;
      },
    );
    return {
      calendar: testData.calendar,
      dates: differentDates,
    };
  });
}
