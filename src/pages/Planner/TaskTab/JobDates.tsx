import moment from "moment";
// @ts-ignore
import { textDirection } from "../../../functions/textDirection";

import { capitalize, Grid2 as Grid, Typography } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";

import { useTranslation } from "react-i18next";

interface JobDatesProps {
  job: { [key: string]: any };
}

const isDayFar = (unixTimestamp: number) => {
  const givenDate = moment
    .unix(unixTimestamp / 1000)
    .utc()
    .startOf("day");
  const today = moment().utc().startOf("day");
  const tomorrow = moment().add(1, "day").utc().startOf("day");

  if (givenDate.isAfter(tomorrow)) {
    return givenDate.fromNow() + givenDate.format(" — YYYY-MM-DD");
  } else if (givenDate.isBefore(today)) {
    return givenDate.fromNow() + givenDate.format(" — YYYY-MM-DD");
  } else {
    return "";
  }
};

const JobDates: (props: JobDatesProps) => JSX.Element = ({ job }) => {
  const { i18n } = useTranslation();

  const timedCalendarConfig =
    i18n.language === "ar"
      ? {
          lastDay: "[أمس الساعة] hh:mm A",
          lastWeek: "dddd [الساعة] hh:mm A",
          nextDay: "[غدًا الساعة] hh:mm A",
          nextWeek: "dddd [الساعة] hh:mm A",
          sameDay: "[اليوم الساعة] hh:mm A",
          sameElse: "dddd YYYY-MM-DD",
        }
      : {};

  const dayCalendarConfig =
    i18n.language === "ar"
      ? {
          lastDay: "[أمس] YYYY-MM-DD",
          lastWeek: "dddd YYYY-MM-DD",
          nextDay: "[غدًا] YYYY-MM-DD",
          nextWeek: "dddd YYYY-MM-DD",
          sameDay: "[اليوم]",
          sameElse: "dddd YYYY-MM-DD",
        }
      : {};

  const calendarDateFormatter = (date: number, time: string) => {
    return moment
      .unix(date / 1000)
      .hour(time ? Number(time.slice(0, 2)) : 0)
      .minutes(time ? Number(time.slice(3)) : 0)
      .calendar(time ? timedCalendarConfig : dayCalendarConfig);
  };

  return (
    <Grid container direction="column" gap={1}>
      {job.doAt && (
        <Grid
          container
          alignItems="center"
          justifyContent="start"
          gap={0.5}
          sx={{
            direction:
              textDirection(
                isDayFar(job.doAt)
                  ? isDayFar(job.doAt)
                  : calendarDateFormatter(job.doAt, job.time)
              ) === "left"
                ? "ltr"
                : "rtl",
          }}
        >
          <EditCalendarIcon fontSize="small" color="warning" />

          <Typography
            variant="body2"
            className="app-font"
            sx={{
              color: !job.done
                ? moment
                    .unix(job.doAt / 1000)
                    .utc()
                    .startOf("day")
                    .isBefore(moment().utc().startOf("day"))
                  ? "warning.dark"
                  : "inherit"
                : "inherit",
            }}
          >
            {isDayFar(job.doAt)
              ? capitalize(isDayFar(job.done || job.doAt))
              : capitalize(calendarDateFormatter(job.doAt, job.time))}
          </Typography>
        </Grid>
      )}

      {job.dueAt && (
        <Grid
          container
          alignItems="center"
          justifyContent="start"
          gap={0.5}
          sx={{
            direction:
              textDirection(
                isDayFar(job.dueAt)
                  ? isDayFar(job.dueAt)
                  : calendarDateFormatter(job.dueAt, job.time)
              ) === "left"
                ? "ltr"
                : "rtl",
          }}
        >
          <TodayIcon fontSize="small" color="error" />

          <Typography
            variant="body2"
            className="app-font"
            sx={{
              color: !job.done
                ? moment
                    .unix(job.dueAt / 1000)
                    .utc()
                    .startOf("day")
                    .isBefore(moment().utc().startOf("day"))
                  ? "error.dark"
                  : "inherit"
                : "inherit",
            }}
          >
            {isDayFar(job.dueAt)
              ? capitalize(isDayFar(job.done || job.dueAt))
              : capitalize(calendarDateFormatter(job.dueAt, job.time))}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default JobDates;
