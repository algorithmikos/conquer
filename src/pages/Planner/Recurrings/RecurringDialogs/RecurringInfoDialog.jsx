import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2 as Grid,
  IconButton,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMediaQueries } from "../../../../functions/screenSizes";
import { useProjectStore } from "../../../../store";
import { textDirection } from "../../../../functions/textDirection";
import RecurringFrequency from "../../../../components/Charts/RecurringFrequency";
import { useRecurringStore } from "../../../../stores/recurring";
import moment from "moment";
import { getDueDates } from "../../../../functions/getDueDates";
import { motion } from "framer-motion";
import {
  Close,
  CloseFullscreen,
  Fullscreen,
  Minimize,
} from "@mui/icons-material";

const RecurringInfoDialog = () => {
  const { xs } = useMediaQueries();

  const projectState = useProjectStore((state) => state);
  const { projects } = projectState;

  const dailyState = useRecurringStore((state) => state);
  const {
    instance,
    setInstance,

    dialogs,
    setDialog,

    dayOfRecord,
  } = dailyState;

  const [expand, setExpand] = useState(false);

  const { modified: daily } = instance;
  const fullCalendar = daily?.completedDates
    ? getAllTimestampsBetween(daily?.completedDates)
    : [];

  const findProjectTitle = (documentId) => {
    const matchingDocument = projects?.find(
      (document) => document.$id === documentId
    );
    return matchingDocument ? matchingDocument.title : ""; // Handle cases where project is not found
  };

  const onClose = () => {
    setDialog("info", false);
    setInstance("modified", {});
    setExpand(false);
  };

  function getNext(daily) {
    let repeatence;
    switch (daily.repeats) {
      case "monthly":
        repeatence = "month";
        break;
      case "weekly":
        repeatence = "week";
        break;
      case "daily":
        repeatence = "day";
        break;
    }

    const dates = [];
    let currentDate = moment(daily.startDate);

    for (let i = 0; i < 5; i++) {
      dates.push(currentDate?.clone().format("YYYY-MM-DD")); // Or any desired format
      currentDate?.add(daily.repeatOccurance, repeatence);
    }

    return dates;
  }

  function groupTimestampsByMonthAndWeek(timestamps) {
    // Step 1: Group by month
    const months = timestamps.reduce((acc, timestamp) => {
      const date = moment.unix(timestamp / 1000).utc();
      const monthKey = date.format("YYYY-MM"); // Unique key for each month

      // Initialize the month array if it doesn't exist
      if (!acc[monthKey]) acc[monthKey] = [];

      // Push each day's date to the corresponding month
      acc[monthKey].push(date);
      return acc;
    }, {});

    // Step 2: Group each month's days by week
    const groupedByMonthAndWeek = Object.entries(months).reduce(
      (acc, [monthKey, days]) => {
        acc[monthKey] = days.reduce((weeks, day) => {
          const weekOfMonth = day.week(); // Week of the year (or use `.isoWeek()` for ISO week)

          // Initialize the week array if it doesn't exist
          if (!weeks[weekOfMonth]) weeks[weekOfMonth] = [];

          // Push the day into the corresponding week array
          weeks[weekOfMonth].push(day);
          return weeks;
        }, {});

        return acc;
      },
      {}
    );

    return groupedByMonthAndWeek;
  }

  function getAllTimestampsBetween(timestamps) {
    // Find the oldest and newest timestamps
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    // Convert them to moment dates
    const startDate = moment
      .unix(minTimestamp / 1000)
      .utc()
      .startOf("day");
    const endDate = moment
      .unix(maxTimestamp / 1000)
      .utc()
      .startOf("day");

    // Generate all dates between startDate and endDate
    const allTimestamps = [];
    let currentDate = startDate;

    while (currentDate.isSameOrBefore(endDate)) {
      allTimestamps.push(currentDate.valueOf()); // Push the UNIX timestamp
      currentDate = currentDate.add(1, "day"); // Move to the next day
    }

    return allTimestamps.filter((timestamp) => {
      return (daily.repeats === "daily" && daily.repeatOccurance > 1) ||
        (daily.repeats === "weekly" && daily.repeatOccurance > 1) ||
        (daily.repeats === "weekly" && daily.repeatanceDays.length) ||
        (daily.repeats === "monthly" && daily.repeatOccurance > 1)
        ? getDueDates(daily, dayOfRecord)?.dueDates?.includes(timestamp)
        : true;
    });
  }

  return (
    <Dialog
      TransitionComponent={Zoom}
      onClose={onClose}
      open={dialogs.info}
      fullScreen={xs || expand}
    >
      <DialogTitle sx={{ mx: 1.5, mb: 0 }}>
        <Grid
          container
          justifyContent="space-between"
          sx={{
            direction: textDirection(daily.title) === "left" ? "ltr" : "rtl",
          }}
        >
          <Grid>
            {textDirection(daily.title) === "left" ? "Info of" : "معلومات"}{" "}
            {daily.title}
          </Grid>
          <Grid>
            {!xs && (
              <IconButton
                onClick={() => setExpand(!expand)}
                title={expand ? "Minimize" : "Expand"}
              >
                {expand ? <CloseFullscreen /> : <Fullscreen />}
              </IconButton>
            )}
            <IconButton color="default" onClick={onClose}>
              <Close />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mx: 1.5 }}>
        <Typography variant="body2" sx={{ color: "skyblue" }}>
          Here's the Info about this task:
        </Typography>
        <Typography variant="body2">
          - Projects:{" "}
          {daily.projects?.map((projectId) => findProjectTitle(projectId)) ||
            "None"}
        </Typography>
        <Typography variant="body2">
          - Added on: {moment(daily.$createdAt).format("YYYY-MM-DD")}
        </Typography>
        <Typography variant="body2">
          - Started on:{" "}
          {moment(daily.startedAt)?.format("YYYY-MM-DD") || "Not set"}
        </Typography>
        <Typography variant="body2">
          - Last Modified on: {moment(daily.$updatedAt).format("YYYY-MM-DD")}
        </Typography>
        This task repeats {daily.repeats} every {daily.repeatOccurance}
        <ul>
          {getDueDates(daily, dayOfRecord)
            ?.dueDates?.toReversed()
            .filter((date) => date > moment(dayOfRecord).valueOf())
            .slice(0, 5)
            .map((date) => (
              <li key={date}>
                {moment
                  .unix(date / 1000)
                  .utc()
                  .format("dddd، YYYY-MM-DD")}
              </li>
            ))}
        </ul>
        {/* <RecurringFrequency daily={daily} /> */}
        <Grid container direction="column" gap={1} alignItems="center">
          {Object.entries(groupTimestampsByMonthAndWeek(fullCalendar))
            .reverse()
            .map(([monthKey, weeks]) => (
              <Grid
                key={monthKey}
                container
                direction="column"
                alignItems="center"
                gap={1}
                sx={{
                  direction:
                    textDirection(daily.title) === "left" ? "ltr" : "rtl",
                }}
              >
                <Divider sx={{ width: "100%", my: 2 }}>
                  {moment(monthKey, "YYYY-MM").format("MMMM YYYY")}
                </Divider>

                {Object.entries(weeks)
                  .reverse()
                  .map(([weekOfMonth, days]) => (
                    <Grid
                      key={weekOfMonth}
                      container
                      // direction="column"
                      alignItems="center"
                      gap={1}
                      sx={{
                        direction:
                          textDirection(daily.title) === "left" ? "ltr" : "rtl",
                      }}
                    >
                      <Typography variant="body2" sx={{ color: "skyblue" }}>
                        الأسبوع {weekOfMonth} —
                      </Typography>
                      {days.map((day) => {
                        const isDayCompleted = daily?.completedDates?.includes(
                          day.valueOf()
                        );
                        const isDaySkipped = daily?.skippedDates?.includes(
                          day.valueOf()
                        );

                        return (
                          <motion.div
                            key={day}
                            whileHover={{
                              scale: 1.2,
                            }}
                          >
                            <Chip
                              label={moment(day).format("D")}
                              sx={{
                                ":hover": {
                                  bgcolor: isDayCompleted ? "white" : "",
                                  cursor: "default",
                                },
                              }}
                              color={
                                isDayCompleted
                                  ? "success"
                                  : isDaySkipped
                                  ? "warning"
                                  : "error"
                              }
                              variant={
                                isDayCompleted || isDaySkipped
                                  ? "filled"
                                  : "outlined"
                              }
                            />
                          </motion.div>
                        );
                      })}
                    </Grid>
                  ))}
              </Grid>
            ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringInfoDialog;
