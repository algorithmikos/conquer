// @ts-nocheck
import {
  DialogOptions,
  InstanceOptions,
  useRecurringStore,
} from "../../../stores/recurring";

import { getDueDates } from "../../../functions/getDueDates";

import { deleteTask } from "../../../functions/db/CRUD/delete";

import { textDirection } from "../../../functions/textDirection";
import { useMediaQueries } from "../../../functions/screenSizes";
import { Box, Checkbox, Grid2 as Grid } from "@mui/material";

import OptionsMenu from "../../../components/OptionsMenu/OptionsMenu";
import moment from "moment";
import { RecurringTask } from "../../../functions/backend/schemas/RecurringTask.model";
import { handleRecurringTaskCheck } from "../../../functions/backend/hooks/RecurringTask.hook";
import { useTranslation } from "react-i18next";
import {
  Delete,
  Done,
  DoneAll,
  DoNotDisturb,
  Edit,
  Info,
  SkipNext,
} from "@mui/icons-material";
import { eisenhower } from "../../../functions/eisenhower";
import { useUtilsStore } from "../../../store";
import { useRef, useState } from "react";

interface TaskHeaderProps {
  task: RecurringTask;
  checkedObserver: boolean;
  handleTaskCheck: (
    recurringTask: RecurringTask,
    completionDate?: number
  ) => void;
  setInstance: (type: InstanceOptions, instanceObject: RecurringTask) => void;
  setDialog: (dialogName: DialogOptions, value: boolean) => void;
  optionMenuItems?: { [key: string]: any }[];
  completionDate?: number;
  injectedDoR?: boolean;
}

/**
 * The TaskHeader component is a header component for a task in the planner.
 * It displays the title of the task, a checkbox to mark the task as done, and
 * an options menu to edit, delete, or view the task.
 *
 * @param {task} task - The task to display.
 * @param {checkedObserver} checkedObserver - Whether the task is checked or not.
 * @param {handleTaskCheck} handleTaskCheck - Function to call when the task is checked.
 * @param {setInstance} setInstance - Function to call when an instance is set.
 * @param {setDialog} setDialog - Function to call when a dialog is set.
 * @param {optionMenuItems} optionMenuItems - Optional items for the options menu.
 * @returns {JSX.Element} The rendered component.
 */
const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  checkedObserver,
  handleTaskCheck,
  setInstance,
  setDialog,
  optionMenuItems = [],
  completionDate,
  injectedDoR,
}: TaskHeaderProps) => {
  const { t, i18n } = useTranslation();
  const { xs, sm, md, lg, xl } = useMediaQueries();

  const { dayOfRecord } = useRecurringStore((state) => state);
  const { hideContent } = useUtilsStore((state) => state);

  const injectedMoment =
    completionDate &&
    moment
      .unix(completionDate / 1000)
      .utc()
      .format("YYYY-MM-DD");

  const iconStyle = {
    // App Language is LTR script
    mr: i18n.dir() === "ltr" ? 1 : 0,
    // App Language is RTL script
    ml: i18n.dir() === "rtl" ? 1 : 0,
  };

  return (
    // Header Container
    <Grid
      container
      alignItems="center"
      flexDirection={
        textDirection(task.title) === "left" ? "row" : "row-reverse"
      }
      className="card-header task"
      sx={{
        pt: 0.5,
        "&:hover": { bgcolor: task.color ? "rgba(0,0,0,0.1)" : "default" },
      }}
    >
      {/* Checkbox */}
      <Checkbox
        size={xs ? "large" : "medium"}
        checked={checkedObserver}
        disabled={
          injectedDoR
            ? !getDueDates(task, injectedMoment)?.isDue
            : !getDueDates(task, dayOfRecord)?.isDue
        }
        onChange={(e) => {
          completionDate
            ? handleTaskCheck(task, completionDate)
            : handleTaskCheck(task);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setInstance(InstanceOptions.Modified, task);
          setDialog(DialogOptions.Modify, true);
        }}
        sx={{
          mx: 0.5,
          color: `${eisenhower(task.priority).color}.dark`,
          "&.Mui-checked": {
            color: `${eisenhower(task.priority).color}.dark`,
          },
        }}
        checkedIcon={
          task.skippedDates &&
          task.skippedDates.length > 0 &&
          task.skippedDates.includes(
            moment.utc(dayOfRecord).startOf("day").valueOf()
          ) ? (
            <DoNotDisturb color="warning" />
          ) : task.checklist && task.checklist.length > 0 ? (
            <DoneAll />
          ) : (
            <Done />
          )
        }
      />
      {/* End of Checkbox */}

      {/* Daily Title */}
      <Box
        sx={{
          mr: textDirection(task.title) === "right" ? (xs ? -3 : -1) : "none",
          ml: textDirection(task.title) === "left" ? (xs ? -3 : -1) : "none",
          // width: "70%",
          overflowX: "hidden",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
          textAlign: textDirection(task.title),
          cursor: "pointer",
          filter: hideContent ? "blur(4px)" : "none",
          flexGrow: 1,
        }}
        onClick={() => {
          setInstance(InstanceOptions.Modified, task);
          setDialog(DialogOptions.Modify, true);
        }}
      >
        {checkedObserver ? (
          <s style={{ color: "GrayText" }}>{task.title}</s>
        ) : (
          task.title
        )}
      </Box>
      {/* End of Daily Title */}

      {/* Card Options */}
      <Box className="card-options">
        <OptionsMenu
          options={[
            {
              category: "dailies",
              name: t("Edit"),
              icon: <Edit sx={iconStyle} />,
              textColor: "skyblue",
              onClick: () => {
                setInstance(InstanceOptions.Modified, task);
                setDialog(DialogOptions.Modify, true);
              },
            },
            {
              category: "dailies",
              name: t("Info"),
              icon: <Info sx={iconStyle} />,
              textColor: "white",
              onClick: () => {
                setInstance(InstanceOptions.Modified, task);
                setDialog(DialogOptions.Info, true);
              },
            },
            {
              category: "dailies",
              name: t("Delete"),
              icon: <Delete sx={iconStyle} />,
              textColor: "red",
              onClick: () => {
                setInstance(InstanceOptions.Modified, task);
                setDialog(DialogOptions.Delete, true);
              },
            },
            ...optionMenuItems,
          ]}
        />
      </Box>
      {/* End of Card Options */}
    </Grid>

    // ** Header Container **
  );
};

export default TaskHeader;
