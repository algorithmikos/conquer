import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useMediaQueries } from "../../functions/screenSizes";
import { Box, Chip, Grid2 as Grid, Typography } from "@mui/material";

import { useRecurringStore } from "../../stores/recurring";
import { useHabitStore } from "../../stores/habit";
import { recordFilter } from "../../functions/recordFilter";

import { useTodoStore, useUtilsStore } from "../../store";
import { useTranslation } from "react-i18next";

import TaskCard from "../../components/Skeletons/TaskCardSkeleton/TaskCard.skeleton";
import { t } from "i18next";
import { textDirection } from "../../functions/textDirection";
// import addNotification from "react-push-notification";

/**
 * Task Column Renderer
 * @param {columnTitle} columnTitle - Title of task column.
 * @param {columnTabs} columnTabs - An array of column tabs, each item must be an object of label and value.
 * @param {items} items - Array of recurring tasks, jobs or habits...etc.
 * @param {areItemsFetched} areItemsFetched - Loading state of the column data.
 * @param {itemsCount} itemsCount - Number of rendered items in column.
 * @param {setItemsCount} setItemsCount - Setter of number of rendered items in column.
 * @returns a column of tasks
 **/
const TaskColumn = ({
  columnTitle,
  columnTabs,
  columnTabsContainer,
  items,
  areItemsFetched,
  userHasItems,
  itemsCount,
  setItemsCount,
  tabValue,
  setTabValue,
}) => {
  const dailyState = useRecurringStore((state) => state);
  const {
    dailies,
    setDailies,
    setFilteredDailies,
    dayOfRecord,
    instance: recurringInstance,
    setInstance: setRecurringInstance,
  } = dailyState;

  const jobState = useTodoStore((state) => state);
  const {
    todos,
    setTodos,
    instance: jobInstance,
    setInstance: setJobInstance,
  } = jobState;

  const habitState = useHabitStore((state) => state);
  const { habits, setHabits, setFilteredHabits } = habitState;

  const utilsState = useUtilsStore((state) => state);
  const { searchTerm, colors } = utilsState;

  const navigate = useNavigate();
  const { xs, sm, md, lg, xl } = useMediaQueries();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!xs) {
      navigate("/planner/tasks");
    }
  }, [xs]);

  // Column Item Counter [Start]
  useEffect(() => {
    switch (tabValue) {
      case "all":
        setItemsCount(
          items.filter((item) => recordFilter(item, "all", dayOfRecord)).length
        );
        break;
      case "due":
        setItemsCount(
          items.filter((item) => recordFilter(item, "due", dayOfRecord)).length
        );
        break;
      case "not-due":
        setItemsCount(
          items.filter((item) => recordFilter(item, "not-due", dayOfRecord))
            .length
        );
        break;
      case "done":
        setItemsCount(
          items.filter((item) => recordFilter(item, "done", dayOfRecord)).length
        );
        break;
      case "awaited":
        setItemsCount(
          items.filter((item) => recordFilter(item, "awaited", dayOfRecord))
            .length
        );
        break;
      case "timemachine":
        setItemsCount(
          items.filter((item) => recordFilter(item, "timemachine", dayOfRecord))
            .length
        );
        break;
      case "active":
        setItemsCount(items.filter((item) => item.status === "active").length);
        break;
    }
  }, [tabValue, items, dayOfRecord]);
  // Column Item Counter [End]

  const CustomTabButton = ({ label, value }) => {
    return (
      <Grid
        onClick={() => {
          setTabValue(value);
        }}
        sx={{
          cursor: "pointer",
          color: tabValue === value && "skyblue",
          borderBottom: tabValue === value && 1,
          borderColor: tabValue === value && "skyblue",
        }}
      >
        {label}
      </Grid>
    );
  };

  return (
    <>
      <Grid
        container
        sx={{
          mt: xs ? 5 : 2,
          mb: 1,
          px: 1,
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
        maxWidth="var(--task-column-width)"
        direction={
          textDirection(columnTitle) === "right" ? "row-reverse" : "row"
        }
      >
        <Box flexBasis="auto">
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            gap={0.5}
            direction={
              textDirection(columnTitle) === "right" ? "row-reverse" : "row"
            }
          >
            <Typography
              variant="h5"
              component="h1"
              className="app-font"
              title={columnTitle}
              sx={{
                fontWeight: "bold",
                maxInlineSize: i18n.language === "tr" ? "82px" : "100%",
                overflowX: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {columnTitle}
            </Typography>

            <Chip label={itemsCount} color="primary" size="small" />
          </Grid>
        </Box>

        <Box flexBasis="grow">
          <Grid
            container
            gap={xs ? 2 : 1}
            flexDirection={i18n.language === "ar" ? "row-reverse" : "row"}
          >
            {columnTabs.map((tab, index) => (
              <CustomTabButton
                key={index}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Grid>
        </Box>
      </Grid>

      {/* Dailies Column */}
      <Grid
        className="task-column"
        sx={{ bgcolor: "var(--column-bg-color)", borderRadius: 1, p: 0.75 }}
      >
        {items?.length > 0
          ? columnTabsContainer
          : userHasItems
          ? Array.from({ length: 5 }).map((_, index) => (
              <TaskCard key={index} />
            ))
          : columnTabsContainer}
      </Grid>
    </>
  );
};

export default TaskColumn;
