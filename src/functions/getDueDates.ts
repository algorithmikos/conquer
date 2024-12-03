import moment, { Moment } from "moment";
import { RecurringTask } from "./backend/schemas/RecurringTask.model";

export const getDueDates: (
  daily: RecurringTask,
  dayOfRecord: string
) => { isDue: boolean | undefined; dueDates?: number[] } | undefined = (
  daily,
  dayOfRecord
) => {
  // Task is not recurring but rather a job
  if (!daily?.repeats || !daily?.repeatOccurance) {
    return { isDue: true, dueDates: [] };
  }

  const recordDay = moment.utc(dayOfRecord).startOf("day");
  // console.log(recordDay.subtract(1, "days").weekday());

  const startDate: Moment =
    // @ts-ignore
    daily.startedAt
      ? moment.unix(daily.startedAt / 1000).utc()
      : moment.unix(daily.createdAt / 1000).utc();

  // if (daily.title === "Developing Conquer") {
  //   // console.log(
  //   //   dueDates
  //   //.map((date) =>
  //   //     moment
  //   //       .unix(date / 1000)
  //   //       .utc()
  //   //       .format("YYYY-MM-DD")
  //   //   )
  //   // );

  //   console.log();
  // }

  switch (daily.repeats) {
    case "daily":
      // @ts-ignore
      /* Every X Days */ if (daily.repeatOccurance > 1) {
        function getDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          let currentDate = startDate.clone();
          while (currentDate <= endDate) {
            currentDate.add(daily.repeatOccurance, "days");
            dueDates.push(currentDate.clone());
          }
          return dueDates;
        }

        const dueDates = getDatesBetween(startDate, recordDay).map((date) =>
          date.utc().valueOf()
        );

        const isDue = dueDates.includes(recordDay.startOf("day").valueOf());

        return { isDue, dueDates };
      } /* EVERY SINGLE DAY */ else {
        return { isDue: true, dueDates: [] };
      }

    case "weekly":
      // @ts-ignore
      if (daily.repeatOccurance > 1) {
        function getDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          let currentDate = startDate.clone();

          while (currentDate <= endDate) {
            currentDate.add(daily.repeatOccurance, "weeks");
            dueDates.push(currentDate.clone());
          }

          return dueDates.map((date) => date.utc().valueOf());
        }

        const dueDatesWeekStarts = getDatesBetween(startDate, recordDay);

        function getWeekDaysAfter(dateMoments: number[]) {
          const result: Moment[][] = [];

          dateMoments.forEach((dateMoment) => {
            const startDate = moment
              .unix(dateMoment / 1000)
              .utc()
              .clone();

            // Create an array of days from startDate to endDate
            const weekDays = Array.from({ length: 7 }, (_, index) =>
              startDate.clone().add(index, "days")
            );

            result.push(weekDays);
          });

          return result;
        }

        const dueDates = getWeekDaysAfter(dueDatesWeekStarts)
          .flat()
          .filter((date) => daily.repeatanceDays?.includes(date.day()))
          .map((date) => date?.utc().valueOf());

        const isDue = dueDates.includes(recordDay.valueOf());

        return { isDue, dueDates };
      } else {
        /* 
          0 Sunday
          1 Monday
          2 Tuesday
          3 Wednesday
          4 Thursday
          5 Friday
          6 Saturday
        */

        function getDueDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          const currentDate = startDate.clone();

          while (currentDate <= endDate) {
            currentDate.add(daily.repeatOccurance, "weeks");
            // if (startDate.date() > currentDate.date()) {
            //   if (currentDate.daysInMonth() === startDate.date()) {
            //     currentDate.set("date", startDate.date());
            //   }
            // }
            dueDates.push(currentDate.clone());
          }

          return dueDates;
        }

        const dueDates = getDueDatesBetween(startDate, recordDay)
          .map((date) => date.utc().startOf("day").valueOf())
          .filter((date) =>
            daily.repeatanceDays?.includes(
              moment
                .unix(date / 1000)
                .utc()
                .startOf("day")
                .day()
            )
          );

        return {
          isDue: daily.repeatanceDays?.includes(recordDay.weekday()),
          dueDates: dueDates,
        };
      }

    case "monthly":
      if (daily.repeatsOn === "month-day") {
        function getDueDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          const currentDate = startDate.clone();

          while (currentDate <= endDate) {
            currentDate.add(daily.repeatOccurance, "months");
            if (startDate.date() > currentDate.date()) {
              if (currentDate.daysInMonth() === startDate.date()) {
                currentDate.set("date", startDate.date());
              }
            }
            dueDates.push(currentDate.clone());
          }

          return dueDates;
        }

        const dueDates = getDueDatesBetween(startDate, recordDay).map((date) =>
          date.utc().valueOf()
        );

        const isDue = dueDates.includes(recordDay.startOf("day").valueOf());

        return { isDue, dueDates };
      } else if (daily.repeatsOn === "week-day") {
        /*** Only Development Phase Helping Function
        
        function weekdayOccurrence(date: Moment) {
          const dayOfWeek = date.format("dddd");
          const ordinal = Math.ceil(date.date() / 7);
          const month = date.format("MM");

          return ordinal;
          return `This is the ${ordinal} ${dayOfWeek} of ${month}\n`;
        }

        ***/

        function getDueDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          const startWeekdayOccurrence = Math.ceil(startDate.date() / 7);

          let currentDate = startDate.clone().add(1, "month");

          while (currentDate <= endDate) {
            // Calculate the start of the first week of the month
            const monthStart = currentDate.clone().startOf("month");

            // Calculate the day of the week for the start of the first week
            const firstWeekDay = monthStart.day();

            // Calculate the offset to the first occurrence of the target weekday
            const offset = (startDate.day() - firstWeekDay + 7) % 7;

            // Calculate the target date
            const targetDate = monthStart
              .clone()
              .add(offset + (startWeekdayOccurrence - 1) * 7, "days");

            dueDates.push(targetDate.clone());
            currentDate.add(1, "month");
          }

          return dueDates;
        }

        const dueDates = getDueDatesBetween(startDate, recordDay).map((date) =>
          date.utc().valueOf()
        );

        const isDue = dueDates.includes(recordDay.startOf("day").valueOf());

        return { isDue, dueDates };
      }
      break;

    case "yearly":
      // @ts-ignore
      /* Every X Years */ if (daily.repeatOccurance) {
        function getDatesBetween(startDate: Moment, endDate: Moment) {
          const dueDates = [startDate];
          let currentDate = startDate.clone();
          while (currentDate <= endDate) {
            currentDate.add(daily.repeatOccurance, "years");
            dueDates.push(currentDate.clone());
          }
          return dueDates;
        }

        const dueDates = getDatesBetween(startDate, recordDay).map((date) =>
          date.utc().valueOf()
        );

        const isDue = dueDates.includes(recordDay.startOf("day").valueOf());

        return { isDue, dueDates };
      }
      break;

    default:
      return { isDue: false, dueDates: [] };
  }
};
