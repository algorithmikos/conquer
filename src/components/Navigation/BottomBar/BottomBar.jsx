import React, { useState } from "react";

import "./BottomBar.css";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SwapVerticalCircleIcon from "@mui/icons-material/SwapVerticalCircle";
import { Link, useLocation } from "react-router-dom";
import {
  usePillarStore,
  useProjectStore,
  useTodoStore,
  useUtilsStore,
} from "../../../store";
import { useHabitStore } from "../../../stores/habit";
import { Box } from "@mui/material";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useRecurringStore } from "../../../stores/recurring";
import { useTranslation } from "react-i18next";
import { Storage } from "@mui/icons-material";

const BottomBar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const [value, setValue] = useState("home");

  const { colors } = useUtilsStore((state) => state);

  const dailyState = useRecurringStore((state) => state);
  const { setDialog: setRecurringDialog } = dailyState;

  const todoState = useTodoStore((state) => state);
  const { setDialog: setJobDialog } = todoState;

  const habitState = useHabitStore((state) => state);
  const { setDialog: setHabitDialog } = habitState;

  const pillarState = usePillarStore((state) => state);
  const { setDialog: setPillarDialog } = pillarState;

  const questState = useProjectStore((state) => state);
  const { setDialog: setQuestDialog } = questState;

  const settings = [
    t("Dashboard"),
    t("Pillars"),
    t("Projects"),
    t("Systems"),
    t("TM_1500"),
    t("Settings"),
    t("Logout"),
  ];

  const availablePaths = [
    "/planner/dailies",
    "/planner/todos",
    "/planner/habits",
    "/planner/pillars",
    "/planner/projects",
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addButtonActions = () => {
    switch (location.pathname) {
      case "/planner/dailies":
        setRecurringDialog("new", true);
        break;
      case "/planner/todos":
        setJobDialog("new", true);
        break;
      case "/planner/habits":
        setHabitDialog("new", true);
        break;
      case "/planner/pillars":
        setPillarDialog("new", true);
        break;
      case "/planner/projects":
        setQuestDialog("new", true);
        break;
      default:
        alert("Not implemented yet");
    }
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Εnsures that the Paper is above other elements.
        pointerEvents: "auto", // Ensures that the Paper and its contents can be clicked or interacted with, but blocks interaction with any underlying elements.
      }}
      elevation={3}
    >
      {availablePaths.includes(location.pathname) && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            height: 60,
            width: 60,
            position: "absolute",
            transform: "translateY(-20px) translateX(-25px)",
          }}
          variant="extended"
          onClick={addButtonActions}
        >
          <AddIcon />
        </Fab>
      )}

      <BottomNavigation
        value={location.pathname}
        onChange={handleChange}
        sx={{
          background: colors?.main_bg_gradient,
          height: 55,
          zIndex: 1000, // Ensures BottomNavigation stays on top of everything
        }}
        showLabels
      >
        <BottomNavigationAction
          label={t("Jobs")}
          value="/planner/todos"
          icon={<TaskAltIcon />}
          component={Link}
          to="/planner/todos"
        />

        <BottomNavigationAction
          label={t("Recurrings")}
          value="/planner/dailies"
          icon={<EventAvailableIcon />}
          component={Link}
          to="/planner/dailies"
        />

        {availablePaths.includes(location.pathname) && (
          <Box sx={{ width: 80, height: 55 }} />
        )}

        <BottomNavigationAction
          label={t("Habits")}
          value="/planner/habits"
          icon={<SwapVerticalCircleIcon />}
          component={Link}
          to="/planner/habits"
        />

        <BottomNavigationAction
          label={t("Systems")}
          value="/systems"
          icon={<Storage />}
          component={Link}
          to="/systems"
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomBar;
