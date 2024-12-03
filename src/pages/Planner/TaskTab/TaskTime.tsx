// @ts-nocheck
import { Grid2 as Grid, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { textDirection } from "../../../functions/textDirection";
import { useTranslation } from "react-i18next";

interface TaskTimeProps {
  task: { [key: string]: any };
}

const TaskTime: (props: TaskTimeProps) => JSX.Element | undefined = ({
  task,
}) => {
  const { i18n } = useTranslation();
  const isCurrentHour: (hourString: string) => Boolean = (hourString) => {
    // Check for valid hour format (assumes 24-hour format with colon)
    const hourRegex = /^([0-1][\d]|2[0-3]):[0-5][0-9]$/;
    if (!hourRegex.test(hourString)) {
      return false;
    }

    // Extract hour from the string
    const hour = parseInt(hourString.split(":")[0]);

    // Get the current date at midnight (00:00)
    const now = new Date();
    now.setMinutes(0, 0, 0);

    // Create a date object representing the hour from the string
    const hourDate = new Date();
    hourDate.setHours(hour, 0, 0, 0);

    // Check if the dates (representing hours only) are equal
    return now.getTime() === hourDate.getTime();
  };

  const convertTimeTo12h: (
    timeString: string,
    textDirection: string
  ) => string = (timeString, textDirection) => {
    // Check for valid time format
    const timeRegex = /^([0-1][\d]|2[0-3]):([0-5][\d])$/;
    if (!timeRegex.test(timeString)) {
      return "Invalid time format";
    }

    // Extract hours and minutes
    const [hours, minutes] = timeString.split(":");

    // Convert to 12-hour format
    let convertedHours = parseInt(hours);
    let meridian = "AM";
    if (textDirection === "right") {
      meridian = "ص";
    }
    if (convertedHours >= 12) {
      convertedHours -= 12;
      if (textDirection === "right") {
        meridian = "م";
      } else {
        meridian = "PM";
      }
    }
    if (convertedHours === 0) {
      convertedHours = 12;
    }

    // Format the output string
    return `${convertedHours
      .toString()
      .padStart(2, "0")}:${minutes} ${meridian}`;
  };

  if (task.time) {
    return (
      <Grid
        container
        gap={0.5}
        justifyContent={i18n.language === "ar" ? "end" : "start"}
        alignItems="stretch"
        direction={i18n.language === "ar" ? "row" : "row-reverse"}
      >
        <Grid>
          <Typography
            variant="body2"
            sx={{
              direction: textDirection(task.title) === "right" ? "rtl" : "ltr",
            }}
            color={isCurrentHour(task.time) ? "primary" : "textPrimary"}
            className={`app-font`}
          >
            {convertTimeTo12h(task.time, textDirection(task.title))}
          </Typography>
        </Grid>

        <Grid>
          <AccessTimeIcon fontSize="small" color="warning" />
        </Grid>
      </Grid>
    );
  }
};

export default TaskTime;
