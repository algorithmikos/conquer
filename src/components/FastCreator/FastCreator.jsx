import React, { useState } from "react";
import { Alert, Grow, TextField } from "@mui/material";
import { useMediaQueries } from "../../functions/screenSizes";
import RecurringTaskController from "../../functions/backend/functions/RecurringTask";
import JobController from "../../functions/backend/functions/Job";
import HabitController from "../../functions/backend/functions/Habit";
import { textDirection } from "../../functions/textDirection";
import { useTranslation } from "react-i18next";

const FastCreator = ({ placeholder, collection }) => {
  const { xs, sm, md, lg, xl } = useMediaQueries();
  const { t, i18n } = useTranslation();
  const { createRecurringTask } = RecurringTaskController();
  const { createJob } = JobController();
  const { createHabit } = HabitController();

  const [focused, setFocused] = useState(false);

  if (!xs) {
    return (
      <TextField
        size="small"
        sx={{ mb: 0.5 }}
        fullWidth
        multiline
        placeholder={placeholder}
        onChange={(e) => {
          if (e.target.value) {
            textDirection(e.target.value) === "left"
              ? (e.target.dir = "ltr")
              : (e.target.dir = "rtl");
          } else {
            e.target.dir = "ltr";
          }
        }}
        onBlur={(e) => {
          setFocused(false);
          e.target.value = "";
          e.target.dir = "ltr";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!e.shiftKey) {
              e.preventDefault();
              const tasks = e.target.value.split("\n").filter((task) => task);
              switch (collection) {
                case "dailies":
                  tasks.forEach((task) => {
                    createRecurringTask({ title: task });
                  });
                  break;
                case "jobs":
                  tasks.forEach((task) => {
                    createJob({ title: task });
                  });
                  break;
                case "habits":
                  tasks.forEach((task) => {
                    createHabit({ title: task });
                  });
                  break;
                default:
                  console.log("collection isn't specified");
              }
              e.target.value = "";
            }
          }
        }}
        onFocus={() => setFocused(true)}
        helperText={
          <Grow in={focused} timeout={750} mountOnEnter unmountOnExit>
            <Alert
              severity="info"
              className="app-font"
              sx={{
                mt: 0.75,
                p: 1,
                width: "var(--task-card-width)",
              }}
            >
              {t("FastCreatorHelperText")}
            </Alert>
          </Grow>
        }
        FormHelperTextProps={{
          sx: {
            p: 0,
            m: 0,
            direction: i18n.language === "ar" ? "rtl" : "ltr",
            textAlign: i18n.language === "ar" ? "right" : "left",
          },
        }}
      />
    );
  }
};

export default FastCreator;
