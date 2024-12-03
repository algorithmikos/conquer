// @ts-nocheck
import moment from "moment";
import { useRecurringStore } from "../../../stores/recurring";

import { getDueDates } from "../../../functions/getDueDates";

import {
  Box,
  Checkbox,
  Collapse,
  Grid2 as Grid,
  Paper,
  Zoom,
  Typography,
} from "@mui/material";

import { textDirection } from "../../../functions/textDirection";
import { useEffect, useState } from "react";
import { useMediaQueries } from "../../../functions/screenSizes";
import { RadioButtonUnchecked, TaskAlt } from "@mui/icons-material";
import { useSubRecurringStore } from "../../../stores/subRecurring";
import { CollectionOptions, dbm } from "../../../backend/database/dbm";
import { useUtilsStore } from "../../../store";

interface TaskSubTasksCollapseProps {
  task: { [key: string]: any };
  checklistStatus: { [key: string]: Boolean };
  parentIndex: number;
  handleChecklistItemCheck: (
    parentTask: { [key: string]: any },
    childTask: { [key: string]: any },
    completionDate?: number
  ) => void;
  checkedObserver: (childTask) => boolean;
  completionDate?: number;
  injectedDoR?: boolean;
  id?: string | number;
}

const TaskSubTasksCollapse: (
  props: TaskSubTasksCollapseProps
) => JSX.Element = ({
  checklistStatus,
  task,
  parentIndex,
  handleChecklistItemCheck,
  checkedObserver,
  completionDate,
  injectedDoR,
  id,
}) => {
  const { xs } = useMediaQueries();

  const dailyState = useRecurringStore((state) => state);
  const { dayOfRecord } = dailyState;

  const subRTState = useSubRecurringStore((state) => state);
  const { subRTs } = subRTState;

  const { hideContent } = useUtilsStore((state) => state);

  const injectedMoment =
    completionDate &&
    moment
      .unix(completionDate / 1000)
      .utc()
      .format("YYYY-MM-DD");

  const handleCheckChange = (taskId) => {
    setCheckedStates((prevStates) => ({
      ...prevStates,
      [taskId]: !prevStates[taskId],
    }));
  };

  return (
    <Collapse
      mountOnEnter
      unmountOnExit
      in={id ? checklistStatus[id] : !checklistStatus[task.$id]}
    >
      <Paper elevation={0} sx={{ bgcolor: task?.color ?? "transparent" }}>
        {task.checklist &&
          task.checklist
            .map((itemId, index) => {
              if (typeof itemId !== "string") return itemId;

              const target = subRTs.find((subRT) => subRT.$id === itemId);

              if (target) {
                return target;
              } else {
                return { $id: index, item: "Item Render Error" };
              }
            })
            ?.map((childTask: { [key: string]: any }, childIndex: number) => (
              <Grid
                key={`${parentIndex}-child-task-${childIndex}`}
                container
                justifyContent={
                  textDirection(childTask?.item) === "left" ? "start" : "end"
                }
                alignItems="start"
                sx={{
                  pr: textDirection(childTask?.item) === "right" ? 3.5 : 0,
                  pl: textDirection(childTask?.item) === "left" ? 3.5 : 0,
                  mt: xs ? (childIndex === 0 ? 0.5 : 2) : -1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: task.color ? "rgba(0,0,0,0.1)" : "default",
                  },
                }}
                className="task"
                direction={
                  textDirection(childTask?.item) === "left"
                    ? "row"
                    : "row-reverse"
                }
              >
                {checkedObserver(childTask) ? (
                  <Checkbox
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<TaskAlt />}
                    disabled={
                      injectedDoR
                        ? !getDueDates(task, injectedMoment)?.isDue
                        : !getDueDates(task, dayOfRecord)?.isDue
                    }
                    checked={true}
                    onChange={() =>
                      completionDate
                        ? handleChecklistItemCheck(
                            task,
                            childTask,
                            completionDate
                          )
                        : handleChecklistItemCheck(task, childTask)
                    }
                    color="info"
                    sx={{ flexGrow: "10%" }}
                  />
                ) : (
                  <Checkbox
                    icon={<RadioButtonUnchecked />}
                    checkedIcon={<TaskAlt />}
                    disabled={
                      injectedDoR
                        ? !getDueDates(task, injectedMoment)?.isDue
                        : !getDueDates(task, dayOfRecord)?.isDue
                    }
                    checked={false}
                    onChange={() =>
                      completionDate
                        ? handleChecklistItemCheck(
                            task,
                            childTask,
                            completionDate
                          )
                        : handleChecklistItemCheck(task, childTask)
                    }
                    color="info"
                    sx={{ flexGrow: "10%" }}
                  />
                )}

                <Grid
                  sx={{
                    flexGrow: "90%",
                    wordBreak: "break-word",
                    textAlign:
                      textDirection(childTask?.item) === "left"
                        ? "start"
                        : "end",
                    direction:
                      textDirection(childTask?.item) === "left" ? "ltr" : "rtl",
                    mt: 1,
                    filter: hideContent ? "blur(4px)" : "none",
                  }}
                >
                  <Typography className="app-font">
                    {checkedObserver(childTask) ? (
                      <s style={{ color: "GrayText" }}>{childTask?.item}</s>
                    ) : (
                      childTask?.item
                    )}
                  </Typography>
                </Grid>
              </Grid>
            ))}
      </Paper>
    </Collapse>
  );
};

export default TaskSubTasksCollapse;
