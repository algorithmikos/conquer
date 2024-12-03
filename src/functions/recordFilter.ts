import moment from "moment";
import { getDueDates } from "./getDueDates";
import { RecurringTask } from "./backend/schemas/RecurringTask.model";

/**
 * Filter the daily for display
 * @param {daily} item - The daily object.
 * @param {condition} condition - The condition of rendering.
 * @param {dayOfRecord} dayOfRecord - The day of record.
 * @returns {boolean} The daily if it meets the given condition.
 **/
export const recordFilter = (
  item: RecurringTask,
  condition: string,
  dayOfRecord: string
) => {
  let keepItem = false;
  switch (condition) {
    // Mutual condition in recurring tasks & jobs
    case "full":
      keepItem = true;
      return keepItem;
    // Mutual condition in recurring tasks & jobs
    case "all":
      keepItem = true;

      // @ts-ignore
      if (item.done) {
        keepItem = false;
      }

      return keepItem;
    // Recurring Task Condition
    case "due":
      if (getDueDates(item, dayOfRecord)?.isDue) {
        keepItem = true;
      }

      if (
        item.completedDates?.includes(
          moment.utc(dayOfRecord).startOf("day").valueOf()
        )
      ) {
        keepItem = false;
      }

      if (
        item.skippedDates?.includes(
          moment.utc(dayOfRecord).startOf("day").valueOf()
        )
      ) {
        keepItem = false;
      }

      return keepItem;

    // Recurring Task Condition
    case "not-due":
      if (!getDueDates(item, dayOfRecord)?.isDue) {
        keepItem = true;
      }

      if (
        item.completedDates?.includes(
          moment.utc(dayOfRecord).startOf("day").valueOf()
        )
      ) {
        keepItem = true;
      }

      if (
        item.skippedDates?.includes(
          moment.utc(dayOfRecord).startOf("day").valueOf()
        )
      ) {
        keepItem = true;
      }

      return keepItem;
    // Special Component Condition
    case "timemachine":
      keepItem = true;

      if (!getDueDates(item, dayOfRecord)?.isDue) {
        keepItem = false;
      }

      if (
        item.completedDates?.includes(
          moment.utc(dayOfRecord).startOf("day").valueOf()
        )
      ) {
        keepItem = false;
      }

      if (
        moment
          .utc(dayOfRecord)
          .startOf("day")
          .isBefore(moment.unix(item.createdAt / 1000).startOf("day"))
      ) {
        keepItem = false;
      }

      return keepItem;
    // Job Condition
    case "done":
      keepItem = false;
      // @ts-ignore
      if (item.done) {
        keepItem = true;
      }

      return keepItem;
    // Job Condition
    case "awaited":
      keepItem = false;
      // @ts-ignore
      if (item.dueAt || item.doAt) {
        keepItem = true;
      }

      // @ts-ignore
      if (item.done) {
        keepItem = false;
      }
      return keepItem;
  }
};
